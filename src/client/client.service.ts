/* prettier-ignore */
/* eslint-disable prettier/prettier */
import { ClientDTO } from './dto/client.dto';
import { from, Observable } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { UserRolesService } from 'src/user-roles/user-roles.service';
import { UserRoleType } from '../user-roles/dto/user-role.enum';
import { ClientUserRole } from './entities/client_user-roles.entity';
import { UserRole } from 'src/user-roles/entities/user-role.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(ClientUserRole)
    private readonly clientUserRoleRepository: Repository<ClientUserRole>,
    private readonly userService: UserService,
    private readonly userRoleService: UserRolesService,
  ) {}
  async create(loggedInUser: User, clientDto: CreateClientDto): Promise<any> {
    const userRole = await this.userRoleService.findUserRoleByType(UserRoleType.SUPER_ADMIN);
    clientDto.users = [loggedInUser];
    const client = await this.clientRepository.save(clientDto);

    return await this.clientUserRoleRepository.save({
      clientId: client.id,
      user: loggedInUser,
      userRolesId: userRole.id,
    });

    // return await this.userService.setClientUserRole(userRole,1,client.id);
  }

  async findAll(): Promise<ClientDTO[]> {
    const clients = await this.clientRepository.find({
      relations: ['users']
    });

    for(const client of clients){
      for(const user of client.users){
        user.clientUserRoles  = await this.clientUserRoleRepository.find({where: {clientId : client.id, user: user}})
      }
    }

    return clients;
  }

  async assignUser(user: User, client: Client, role: UserRole): Promise<any> {
    client.users.push(user);

    const clientUser =  await this.clientUserRoleRepository.save({
      clientId: client.id,
      user: user,
      userRolesId: role.id,
    });

    await this.clientRepository.save(client);
    return clientUser;

  }

  async findOne(id: number):Promise<Client> {
    return await this.clientRepository.findOneOrFail(id,{relations:['users']});
  }

  async findById(id: number):Promise<Client> {
    const client = await this.clientRepository.findOneOrFail(id,{relations:['users','stores']});

    for(const user of client.users){
      user.clientUserRoles  = await this.clientUserRoleRepository.find({where: {clientId : client.id, user: user}})
    }
    return client;

  }

  async getClientUserRolesForClient(user: User, clientId: number):Promise<ClientUserRole[]> {
    const clientUserRoles = await this.clientUserRoleRepository.find({where:{user:user, clientId:clientId}});
    for(const role of clientUserRoles){
      role.userRole = await this.userRoleService.findOne(role.userRolesId)
    }
    return clientUserRoles;
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
