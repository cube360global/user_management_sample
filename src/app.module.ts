/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ClientModule } from './client/client.module';
import { StoreModule } from './store/store.module';
import { UserModule } from './user/user.module';
import { UserRolesModule } from './user-roles/user-roles.module';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './utils/jwt.strategy';
import { AuthorizationModule } from './authorization/authorization.module';
import { UtilService } from './utils/util.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './exceptions.filter';
import { RequestInterceptor } from './request.interceptor';

@Module({
  imports: [
    ClientModule,
    StoreModule,
    UserModule,
    UserRolesModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ProductModule,
    ConfigModule.forRoot({ isGlobal: true }), // allow .env variables accessible
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }), AuthorizationModule,
  ],
  controllers: [],
  providers: [
    JwtStrategy,
    UtilService,
    {
			provide: APP_INTERCEPTOR,
			useClass: RequestInterceptor
		},
    {
			provide: APP_FILTER,
			useClass: AllExceptionsFilter,
		},],
  exports: [
		PassportModule,
		JwtStrategy,
    UtilService
	]
})
export class AppModule {}
