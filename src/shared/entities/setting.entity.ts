import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('settings')
@Index(['key'], { unique: true })
export class Setting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  key: string;

  @Column({ type: 'jsonb' })
  value: Record<string, string | number | boolean>;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: false, name: 'is_public' })
  isPublic: boolean;

  @Column({
    type: 'varchar',
    length: 100,
    default: 'string',
    name: 'data_type',
  })
  dataType: string; // string, number, boolean, object, array

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
