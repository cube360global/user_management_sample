/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { ClientModule } from '../client/client.module';
import { AuthService } from '../utils/auth.service';
import { AuthorizationModule } from '../authorization/authorization.module';
import { UtilService } from 'src/utils/util.service';

@Module({
  imports: [
      TypeOrmModule.forFeature([User]),
      AuthorizationModule, 
      forwardRef(() => ClientModule)
  ],
  controllers: [UserController],
  providers: [UserService,AuthService,UtilService],
  exports: [UserService],
})
export class UserModule {}
