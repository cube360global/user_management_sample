/* eslint-disable prettier/prettier */
import { User } from '../../user/entities/user.entity';
import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { UserRole } from 'src/user-roles/entities/user-role.entity';

@Entity('store_user_role')
export class StoreUserRole {
  @PrimaryColumn()
  storeId: number;

  @ManyToOne(() => User, user => user.storeUserRoles,{primary:true})
  user: User;

  @PrimaryColumn()
  userRolesId: number;

  userRole: UserRole;
}
