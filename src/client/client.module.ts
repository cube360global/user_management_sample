/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { Client } from './entities/client.entity';
import { UserRolesModule } from '../user-roles/user-roles.module';
import { UserModule } from '../user/user.module';
import { ClientUserRole } from './entities/client_user-roles.entity';
import { UtilService } from 'src/utils/util.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Client, ClientUserRole]),
	  forwardRef(() => UserRolesModule),
		forwardRef(() => UserModule)],
  controllers: [ClientController],
  providers: [ClientService,UtilService],
  exports: [ClientService]
})
export class ClientModule {}
