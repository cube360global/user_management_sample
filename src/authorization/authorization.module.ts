/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
    JwtModule.register({
        secret: process.env.SECRET || 'afxyermotcspeoopoyxypggwgjmwwxkb',
        signOptions: {
            expiresIn: '24h',
        }
    }),
    ],
    controllers: [],
    providers: [],
    exports: [JwtModule]
})

export class AuthorizationModule {};