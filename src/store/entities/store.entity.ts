import { Client } from 'src/client/entities/client.entity';
import { User } from 'src/user/entities/user.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  ManyToOne,
} from 'typeorm';
@Entity('store')
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '', nullable: false })
  name: string;

  @ManyToOne(() => Client, (client) => client.stores)
  client: Client;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  // @ManyToMany(() => User)
  // @JoinTable({
  //   name: 'store_users',
  // })
  // users: User[];

  // @OneToMany(() => Client, (client) => client.id)
  // @JoinTable({
  //   name: 'client_store',
  // })
  // client: Client;
}
