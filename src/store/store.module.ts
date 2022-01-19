/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { Store } from './entities/store.entity';
import { UserRolesModule } from '../user-roles/user-roles.module';
import { StoreUserRole } from './entities/store_user_roles.entity';
import { UtilService } from '../utils/util.service';
import { ClientModule } from '../client/client.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Store,StoreUserRole]),
    forwardRef(() => UserRolesModule),
    forwardRef(() => ClientModule),
    forwardRef(() => UserModule),
  ],
  controllers: [StoreController],
  providers: [StoreService,UtilService],
  exports: [StoreService],
})
export class StoreModule {}
