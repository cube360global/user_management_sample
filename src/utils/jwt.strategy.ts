/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PassportStrategy, AuthGuard } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { createParamDecorator } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UtilService } from './util.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private utilService: UtilService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET || 'afxyermotcspeoopoyxypggwgjmwwxkb',
    });
    if (!process.env.SECRET) console.log('SECRET not set.');
  }

  // validates user token and returns user's information
  async validate(payload) {
    const { id } = payload;
    const userInfo = await this.userService.findOne(id);
    if (!userInfo) this.utilService.unauthorized();
    return userInfo;
  }
}

export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // Override handleRequest so it never throws an error
  handleRequest(err, user, info, context) {
    console.log('data11',user);
    return user;
  }
}

export const GetUser = createParamDecorator((data, req) => {
  // console.log('data',req.args[0].user);
  return req.args[0].user;
});
