import { ClientUserRole } from 'src/client/entities/client_user-roles.entity';
import { StoreUserRole } from 'src/store/entities/store_user_roles.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
} from 'typeorm';
@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '', nullable: false })
  name: string;

  @Column({ default: '', nullable: false })
  password: string;

  @Column({ default: '', nullable: false })
  salt: string;

  @OneToMany(() => ClientUserRole, (clientUserRole) => clientUserRole.user)
  clientUserRoles: ClientUserRole[];

  @OneToMany(() => StoreUserRole, (storeUserRole) => storeUserRole.user)
  storeUserRoles: StoreUserRole[];
}
