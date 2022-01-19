/* eslint-disable prettier/prettier */
import { FindStoreDto } from './dto/find-store.dto';
import { from, Observable } from 'rxjs';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './entities/store.entity';
import { StoreDTO } from './dto/store.dto';
import { User } from 'src/user/entities/user.entity';
import { Client } from 'src/client/entities/client.entity';
import { UserRole } from 'src/user-roles/entities/user-role.entity';
import { StoreUserRole } from './entities/store_user_roles.entity';
import { UserService } from 'src/user/user.service';
import { UserRolesService } from 'src/user-roles/user-roles.service';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(StoreUserRole)
    private readonly storeUserRoleRepository: Repository<StoreUserRole>,
    @Inject(forwardRef(()=>UserService))
    private userService: UserService,
    @Inject(forwardRef(()=>UserRolesService))
    private readonly userRoleService: UserRolesService,
  ) {}
  async create(createStoreDto: Store): Promise<Store> {
    return await this.storeRepository.save(createStoreDto);
  }

  async findAll(): Promise<StoreDTO[]> {
    const stores = await this.storeRepository.find({ relations: ['client','users'] });

    for(const store of stores){
      for(const user of store.users){
        user.storeUserRoles  = await this.storeUserRoleRepository.find({where: {storeId : store.id, user: user}})
      }
    }
    return stores;
  }

  async assignUser(user: User, store: Store, role: UserRole): Promise<any> {
    // user.storeUserRoles = [{storeId:store.id,user:user}]
    store.users.push(user);
    const storeUser =  await this.storeUserRoleRepository.save({
      storeId: store.id,
      user: user,
      userRolesId: role.id,
    });
    await this.storeRepository.save(store);
    return storeUser;
    // const storeUser =  await this.storeUserRoleRepository.save({
    //   storeId: store.id,
    //   user: user,
    //   userRolesId: role.id,
    // });
    // user.storeUserRoles.push(storeUser)
    // store.users.push(user);
    // // user.storeUserRoles.push(storeUser);

    // console.log('22222');
    // // await this.userService.updateStore(user)
    // console.log('33333');
    // await this.storeRepository.save(store);
    // return storeUser;
    
  }

  async findOne(id: number) {
    return await this.storeRepository.findOneOrFail(id, {
      relations: ['users'],
    });
  }

  async findById(id: number) {
    const store =  await this.storeRepository.findOneOrFail(id, {
      relations: ['users'],
    });

    for(const user of store.users){
        user.storeUserRoles  = await this.storeUserRoleRepository.find({where: {storeId : store.id, user: user}})
    }
    return store;
  }

  async getStoreUserRolesForUser(user: User, storeId?: number):Promise<StoreUserRole[]> {
    let storeUserRoles = [];
    if(storeId){
      storeUserRoles = await this.storeUserRoleRepository.find({where:{user:user, storeId:storeId}});
    }else{
      storeUserRoles = await this.storeUserRoleRepository.find({where:{user:user}});
    }
    for(const role of storeUserRoles){
      role.userRole = await this.userRoleService.findOne(role.userRolesId)
    }
    return storeUserRoles;
  }

  update(id: number, updateStoreDto: UpdateStoreDto) {
    return `This action updates a #${id} store`;
  }

  remove(id: number) {
    return `This action removes a #${id} store`;
  }
}
