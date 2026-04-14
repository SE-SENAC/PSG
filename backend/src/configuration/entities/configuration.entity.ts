import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from "typeorm";

@Entity('configurations')
export class Configuration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  key: string;

  @Column({ type: 'nvarchar', length: 'max' })
  value: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
