/* eslint-disable prettier/prettier */
import { User } from '../../user/entities/user.entity';
import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { UserRole } from 'src/user-roles/entities/user-role.entity';

@Entity('client_user_role')
export class ClientUserRole {
  @PrimaryColumn()
  clientId: number;

  @ManyToOne(() => User, user => user.clientUserRoles,{primary:true})
  user: User;

  @PrimaryColumn()
  userRolesId: number;

  userRole:UserRole;
}
