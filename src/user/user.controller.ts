/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommonResponseModel, ResponseBadRequestMessage, ResponseErrorMessage, ResponseSuccessMessage } from '../utils/app.model';
import { User } from './entities/user.entity';
import { LoginDTO } from './dto/login.dto';
import { AuthService } from '../utils/auth.service';
import { UtilService } from '../utils/util.service';
import { GetUser } from '../utils/jwt.strategy';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService,
    private utilService: UtilService,
    private authService: AuthService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Post('/login')
	@ApiOperation({ description: 'Login with name and password' })
	@ApiResponse({ status: 200, description: 'Return verified detail', type: ResponseSuccessMessage })
	@ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
	public async login(@Body() credentials: LoginDTO): Promise<CommonResponseModel> {
		try {
      const user = await this.userService.findByName(credentials.name);
      if (!user) this.utilService.badRequest('User not found');
      const isValid = await this.authService.verifyPassword(credentials.password, user.password);
      if (!isValid) this.utilService.badRequest('Password invalid');
      const token = await this.authService.generateAccessToken(user.id, '');
			return this.utilService.successResponseData({ token: token, id: user.id });

		} catch (e) {
			this.utilService.errorResponse(e);
		}
	}

  @Get()
  @ApiOperation({ description: 'Get all users' })
	@ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
	@ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
	@ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth()
  findAll(@GetUser() user: any,) {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}


