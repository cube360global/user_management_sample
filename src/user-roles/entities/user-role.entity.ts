import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';
@Entity('user_role')
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  name: string;
}
