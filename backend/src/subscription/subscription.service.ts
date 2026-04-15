import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { STATUS } from './enum/status';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { User } from 'src/user/entities/user.entity';
import { Student } from 'src/student/entities/student.entity';
import { TypeUser } from 'src/type-user/entities/type-user.entity';
import { Course } from 'src/course/entities/course.entity';
import { ROLE } from 'src/type-user/enum/enum';
import { Configuration } from 'src/configuration/entities/configuration.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(TypeUser)
    private readonly typeUserRepository: Repository<TypeUser>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Configuration)
    private readonly configurationRepository: Repository<Configuration>,
  ) {}

  async confirm(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundException('Inscrição não encontrada');
    }

    subscription.status = STATUS.CONFIRMED;
    return this.subscriptionRepository.save(subscription);
  }

  async create(
    user_id: string,
    course_id: string,
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    if (!user_id || !course_id) {
      throw new BadRequestException('User ID and Course ID are required');
    }

    // Check enrollment rules
    await this.checkEnrollmentRules(user_id, course_id);

    const newSubscription = this.subscriptionRepository.create({
      ...createSubscriptionDto,
      user: { id: user_id } as any,
      course: { id: course_id } as any,
      status: STATUS.PENDING, // Default status if not provided
    });

    return await this.subscriptionRepository.save(newSubscription);
  }

  async createPublic(data: any): Promise<Subscription> {
    const {
      name,
      email,
      cpf,
      birth_date,
      family_income,
      number_parents_in_home,
      course_id,
    } = data;

    // 1. Check if course exists
    const course = await this.courseRepository.findOne({
      where: { id: course_id },
    });
    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }

    // 2. Find or Create User/Student
    let student = await this.studentRepository.findOne({
      where: { cpf },
      relations: ['user'],
    });

    let user: User | null = null;

    if (!student) {
      // Check if user with email exists
      user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        // Create skeleton user
        let typeUser = await this.typeUserRepository.findOne({
          where: { role: ROLE.CLIENT },
        });
        if (!typeUser) {
          typeUser = await this.typeUserRepository.save({ role: ROLE.CLIENT });
        }

        const hashedPassword = await bcrypt.hash(cpf.replace(/\D/g, ''), 10); // Default password is CPF

        user = await this.userRepository.save(
          this.userRepository.create({
            name,
            email,
            password: hashedPassword,
            typeUser,
            isActive: true,
          }),
        );
      }

      // Create student
      student = (await this.studentRepository.save(
        this.studentRepository.create({
          cpf,
          birth_date: new Date(birth_date),
          family_income,
          number_parents_in_home,
          user: user,
        } as any),
      )) as unknown as Student;
    } else {
      user = student.user;
    }

    if (!user) {
      throw new BadRequestException('Erro ao processar usuário para inscrição');
    }

    // 3. Check Enrollment Rules
    await this.checkEnrollmentRules(user.id, course_id);

    // 4. Create Subscription
    const subscription = this.subscriptionRepository.create({
      user,
      course,
      status: STATUS.PENDING,
    });

    return await this.subscriptionRepository.save(subscription);
  }

  private async checkEnrollmentRules(userId: string, targetCourseId: string) {
    // Fetch rules from DB
    const maxCoursesConfig = await this.configurationRepository.findOne({
      where: { key: 'psg_max_courses' },
    });
    const allowSameShiftConfig = await this.configurationRepository.findOne({
      where: { key: 'psg_allow_same_shift' },
    });

    const maxCourses = parseInt(maxCoursesConfig?.value || '2');
    const allowSameShift = allowSameShiftConfig?.value === 'true';

    // Existing subscriptions
    const existingSubscriptions = await this.subscriptionRepository.find({
      where: { user: { id: userId } },
      relations: ['course'],
    });

    // Check if already subscribed to this course
    const alreadySubscribed = existingSubscriptions.find(
      (s) => s.course.id === targetCourseId,
    );
    if (alreadySubscribed) {
      throw new BadRequestException('Você já possui uma inscrição neste curso');
    }

    // Check max courses
    if (existingSubscriptions.length >= maxCourses) {
      throw new BadRequestException(
        `Limite de inscrições atingido (${maxCourses} cursos)`,
      );
    }

    // Check shift conflicts
    if (!allowSameShift && existingSubscriptions.length > 0) {
      const targetCourse = await this.courseRepository.findOne({
        where: { id: targetCourseId },
      });
      if (!targetCourse) {
        throw new NotFoundException('Curso alvo não encontrado');
      }

      const sameShift = existingSubscriptions.find(
        (s) => s.course.period_day === targetCourse.period_day,
      );

      if (sameShift) {
        throw new BadRequestException(
          `Conflito de horário: você já possui uma inscrição no turno ${targetCourse.period_day}`,
        );
      }
    }
  }

  async findAll(
    options: IPaginationOptions,
    search?: string,
  ): Promise<Pagination<Subscription>> {
    const queryBuilder = this.subscriptionRepository
      .createQueryBuilder('subscription')
      .leftJoinAndSelect('subscription.user', 'user')
      .leftJoinAndSelect('user.student', 'student')
      .leftJoinAndSelect('subscription.course', 'course');

    if (search) {
      queryBuilder.where(
        '(user.name LIKE :search OR course.title LIKE :search OR student.cpf LIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder.orderBy('subscription.created_at', 'DESC');

    return paginate<Subscription>(queryBuilder, options);
  }

  async findOne(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['user', 'course'],
    });

    if (!subscription) {
      throw new NotFoundException('Inscrição não encontrada');
    }

    return subscription;
  }

  async update(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<UpdateResult> {
    await this.findOne(id);
    return this.subscriptionRepository.update(id, updateSubscriptionDto);
  }

  async remove(id: string): Promise<DeleteResult> {
    await this.findOne(id);
    return this.subscriptionRepository.delete(id);
  }
}
