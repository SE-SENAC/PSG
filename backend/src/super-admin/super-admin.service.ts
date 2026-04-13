import { User } from 'src/user/entities/user.entity';
import { TypeUser } from 'src/type-user/entities/type-user.entity';
import { ROLE } from 'src/type-user/enum/enum';
import { Student } from 'src/student/entities/student.entity';
import { Course } from 'src/course/entities/course.entity';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { SuperAdmin } from './entities/super-admin.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class SuperAdminService {
  constructor(
    @InjectRepository(SuperAdmin)
    private readonly superAdminRepository: Repository<SuperAdmin>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TypeUser)
    private readonly typeUserRepository: Repository<TypeUser>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  findAll() {
    return this.superAdminRepository.find();
  }

  findOne(id: string) {
    return this.superAdminRepository.findOne({ where: { id } });
  }

  findOneByEmail({ email }: { email: string }) {
    return this.userRepository.findOne({
      where: { email },
      relations: ['superAdmin'],
    });
  }

  async createAdminFromScratch(data: {
    name: string;
    email: string;
    password: string;
  }) {
    const { name, email, password } = data;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new Error('Email já está em uso');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let typeUser = await this.typeUserRepository.findOne({
      where: { role: ROLE.SUPERADMIN },
    });
    if (!typeUser) {
      typeUser = await this.typeUserRepository.save({ role: ROLE.SUPERADMIN });
    }

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      isActive: true,
      typeUser: typeUser,
    });

    const savedUser = await this.userRepository.save(user);

    const superAdmin = this.superAdminRepository.create({
      user: savedUser,
    });

    return this.superAdminRepository.save(superAdmin);
  }

  async getDashboardStats() {
    const [totalUsers, totalStudents, totalCourses, totalSubscriptions] =
      await Promise.all([
        this.userRepository.count(),
        this.studentRepository.count(),
        this.courseRepository.count(),
        this.subscriptionRepository.count(),
      ]);

    // Calcular lucro total das inscrições (exemplo simplificado)
    const subscriptions = await this.subscriptionRepository.find({
      relations: ['course'],
    });
    const totalRevenue = subscriptions.reduce((acc, sub) => {
      // Aqui você poderia adicionar lógica de preço se os cursos tiverem preço
      return acc + 0; // Ajustar conforme a regra de negócio do PSG
    }, 0);

    return {
      totalUsers,
      totalStudents,
      totalCourses,
      totalSubscriptions,
      totalRevenue,
    };
  }

  async createAdmin(data: any) {
    // Reutilizando a lógica do AdminService
    const { name, email, password } = data;
    const hashedPassword = await bcrypt.hash(password, 10);

    let typeUser = await this.typeUserRepository.findOne({
      where: { role: ROLE.ADMIN },
    });

    if (!typeUser) {
      typeUser = await this.typeUserRepository.save({ role: ROLE.ADMIN });
    }

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      isActive: true,
      typeUser: typeUser,
    });

    return this.userRepository.save(user);
  }

  async setAdminStatus(userId: string, status: boolean) {
    return this.userRepository.update(userId, { isActive: status });
  }

  async listAdmins(options: IPaginationOptions, search?: string): Promise<Pagination<User>> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.typeUser', 'typeUser')
      .leftJoinAndSelect('user.admin', 'admin')
      .where('typeUser.role = :role', { role: ROLE.ADMIN });

    if (search) {
      queryBuilder.andWhere(
        '(user.name LIKE :search OR user.email LIKE :search)',
        { search: `%${search}%` }
      );
    }

    queryBuilder.orderBy('user.name', 'ASC');

    return paginate<User>(queryBuilder, options);
  }

  async getAdmin(userId: string) {
    return this.userRepository.findOne({
      where: { id: userId, typeUser: { role: ROLE.ADMIN } },
      relations: ['admin'],
    });
  }

  async removeAdmin(userId: string) {
    return this.userRepository.delete(userId);
  }

  remove(id: string) {
    return this.superAdminRepository.delete(id);
  }
}
