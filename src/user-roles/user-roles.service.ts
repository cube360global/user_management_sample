/* eslint-disable prettier/prettier */
import { FindUserRoleDto } from './dto/find-user-role.dto';
import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UserRole } from './entities/user-role.entity';
import { ClientUserRole } from 'src/client/entities/client_user-roles.entity';
import { StoreUserRole } from 'src/store/entities/store_user_roles.entity';
import { CreateStoreUserRolesDto } from 'src/store/dto/create-store-user-roles.dto';
import { CreateClientUserRolesDto } from 'src/client/dto/create-client-user-roles.dto';
import { UserRoleType } from './dto/user-role.enum';
import { ClientService } from 'src/client/client.service';
import { StoreService } from 'src/store/store.service';

@Injectable()
export class UserRolesService {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRolesRepository: Repository<UserRole>,
    @Inject(forwardRef(()=> ClientService))
    private  clientService: ClientService,
    @Inject(forwardRef(()=> StoreService))
    private  storeService: StoreService,
    // @InjectRepository(ClientUserRole)
    // private readonly clientUserRolesRepository: Repository<ClientUserRole>,
    // @InjectRepository(StoreUserRole)
    // private readonly storeUserRolesRepository: Repository<StoreUserRole>,
  ) {}

  create(createUserRoleDto: CreateUserRoleDto): Observable<CreateUserRoleDto> {
    return from(this.userRolesRepository.save(createUserRoleDto));
  }

  createClientUserRoles(
    payload: CreateClientUserRolesDto,
  ): Observable<CreateClientUserRolesDto> {
    // return from(this.clientUserRolesRepository.save(payload));
    return null;
  }

  // create store user roles
  createStoreUserRoles(
    payload: CreateStoreUserRolesDto,
  ): Observable<CreateStoreUserRolesDto> {
    // return from(this.storeUserRolesRepository.save(payload));
    return null;
  }

  findAll(): Observable<FindUserRoleDto[]> {
    return from(this.userRolesRepository.find());
  }

  async findOne(id: number) {
    return await this.userRolesRepository.findOneOrFail(id);
  }

  update(id: number, updateUserRoleDto: UpdateUserRoleDto) {
    return `This action updates a #${id} userRole`;
  }

  remove(id: number) {
    return `This action removes a #${id} userRole`;
  }

  async findUserRoleByType(userRoleType: UserRoleType) {
   let role = '';
   if(userRoleType === UserRoleType.ADMIN){
     role = 'ADMIN';
   }else if(userRoleType === UserRoleType.SUPER_ADMIN){
     role = 'SUPER_ADMIN';
   }else if(userRoleType === UserRoleType.MANAGER){
     role = 'MANAGER';
   }else if(userRoleType === UserRoleType.STAFF){
     role = 'STAFF';
   }
   const userRole =  await this.userRolesRepository.findOneOrFail({where : {name : role}});
   if(!userRole){
    throw new BadRequestException('role not found');
   }
   return userRole;

  }
}
