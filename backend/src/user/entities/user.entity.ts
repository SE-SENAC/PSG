import { Address } from 'src/address/entities/address.entity';
import { Phone } from 'src/phone/entities/phone.entity';
import { SuperAdmin } from 'src/super-admin/entities/super-admin.entity';
import { Student } from 'src/student/entities/student.entity';
import { Admin } from 'src/admin/entities/admin.entity';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { TypeUser } from 'src/type-user/entities/type-user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  isActive: boolean = true;

  @OneToMany(() => Phone, (phone) => phone.user, { cascade: true })
  phones: Phone[];

  @OneToMany(() => Address, (address) => address.user, { cascade: true })
  addresses: Address[];

  @OneToOne(() => Student, (student) => student.user, { cascade: true })
  student: Student;

  @OneToOne(() => SuperAdmin, (superAdmin) => superAdmin.user, { cascade: true })
  superAdmin: SuperAdmin;

  @OneToOne(() => Admin, (admin) => admin.user, { cascade: true })
  admin: Admin;

  @OneToOne(() => Subscription, (subscription) => subscription.user, { cascade: true })
  subscription: Subscription;

  @ManyToOne(() => TypeUser, (typeUser) => typeUser.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'typeUserId' })
  typeUser: TypeUser;
}
