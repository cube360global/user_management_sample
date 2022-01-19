/* eslint-disable prettier/prettier */
import { FindUserDto } from './dto/find-user.dto';
import { from, Observable } from 'rxjs';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { getConnection, Repository } from 'typeorm';
import { ClientService } from '../client/client.service';
import { AuthService } from '../utils/auth.service';
import { listenerCount } from 'process';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(()=>ClientService))
    private  clientService: ClientService,
    private authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<CreateUserDto> {

		const { salt, hashedPassword } = await this.authService.hashPassword(createUserDto.password);
		createUserDto.salt = salt;
		createUserDto.password = hashedPassword;

    return await this.userRepository.save(createUserDto);
  }

  async update(user: User):Promise<User>{
    //console.log('puser',JSON.stringify(user));
    return await this.userRepository.save(user);
  }

  async updateStore(user: User):Promise<any>{
    //console.log('puser',JSON.stringify(user));
    return await getConnection()
    .createQueryBuilder()
    .update(User)
    .set({ storeUserRoles: user.storeUserRoles})
    .where("id = :id", { id: user.id })
    .execute();
  }

  findAll(): Observable<FindUserDto[]> {
    return from(this.userRepository.find());
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOneOrFail(id,{relations: ['clientUserRoles']});
  }

  async findOneForStore(id: number): Promise<User> {
    return await this.userRepository.findOneOrFail(id,{relations: ['storeUserRoles']});
  }

  async findByName(name: string): Promise<User> {
    return await this.userRepository.findOne({where:{name:name}});
  }

  // async setClientUserRole(userRole: UserRole, userId: number, clientId: number): Promise<any> {
  //   const user = await this.userRepository.findOne(userId);
  //   if (user) {
  //     return await this.clientUserRoleRepository.save({
  //       clientId: clientId,
  //       user: user,
  //       userRolesId: userRole.id,
  //     });
  //   }
  // }


  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
