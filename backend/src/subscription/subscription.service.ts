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

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
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

    const existingSubscription = await this.subscriptionRepository.findOne({
      where: {
        user: { id: user_id },
        course: { id: course_id },
      },
    });

    if (existingSubscription) {
      throw new BadRequestException('Usuário já possui inscrição neste curso');
    }

    const newSubscription = this.subscriptionRepository.create({
      ...createSubscriptionDto,
      user: { id: user_id } as any,
      course: { id: course_id } as any,
      status: STATUS.PENDING, // Default status if not provided
    });

    return await this.subscriptionRepository.save(newSubscription);
  }

  async findAll(options: IPaginationOptions, search?: string): Promise<Pagination<Subscription>> {
    const queryBuilder = this.subscriptionRepository.createQueryBuilder('subscription')
      .leftJoinAndSelect('subscription.user', 'user')
      .leftJoinAndSelect('subscription.course', 'course');

    if (search) {
      queryBuilder.where(
        '(user.name LIKE :search OR course.title LIKE :search)',
        { search: `%${search}%` }
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
