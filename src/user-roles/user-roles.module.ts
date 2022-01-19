/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { UserRolesService } from './user-roles.service';
import { UserRolesController } from './user-roles.controller';
import { UserRole } from './entities/user-role.entity';
import { ClientUserRole } from 'src/client/entities/client_user-roles.entity';
import { StoreUserRole } from 'src/store/entities/store_user_roles.entity';
import { ClientModule } from 'src/client/client.module';
import { UserModule } from 'src/user/user.module';
import { StoreModule } from 'src/store/store.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRole]),
    forwardRef(() => ClientModule),
    forwardRef(() => StoreModule),
  ],
  controllers: [UserRolesController],
  providers: [UserRolesService],
  exports: [UserRolesService],
})
export class UserRolesModule {}
