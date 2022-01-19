/* eslint-disable prettier/prettier */
import { Store } from './../../store/entities/store.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity('client')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '', nullable: false })
  name: string;

  // @ManyToMany(() => Store)
  // @JoinTable({
  //   name: 'client_store',
  // })
  // stores: Store[];

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @OneToMany(() => Store, store => store.client)
  stores: Store[];
}
