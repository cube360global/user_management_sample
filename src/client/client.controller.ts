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
  Inject,
  forwardRef,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { UserRolesService } from '../user-roles/user-roles.service';
import { User } from '../user/entities/user.entity';
import { ResponseBadRequestMessage, ResponseErrorMessage, ResponseMessage, ResponseSuccessMessage } from '../utils/app.model';
import { GetUser } from '../utils/jwt.strategy';
import { ClientService } from './client.service';
import { CreateClientUserRolesDto } from './dto/create-client-user-roles.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { AuthGuard } from '@nestjs/passport';
import { UtilService } from '../utils/util.service';
import { AssignUserDTO } from './dto/assign-user.dto';
import { UserService } from '../user/user.service';

@Controller('client')
export class ClientController {
  constructor(
    private readonly clientService: ClientService,
    private userRolesService: UserRolesService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly utilService: UtilService,
  ) {}

  @Post()
  @ApiOperation({ description: 'Create client' })
	@ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
	@ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
	@ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth()
  async create(@GetUser() user: User, @Body() createClientDto: CreateClientDto) {
    this.utilService.validateLoggedInUser(user);
    try{    
      const response =  await this.clientService.create(user,createClientDto);
      if (response) return this.utilService.successResponseData(response);
      else this.utilService.badRequest(ResponseMessage.CLIENT_CREATION_FAILED);
    }catch(e){
      // this.utilService.errorResponse(e);
      this.utilService.badRequest(e.message);
    }

  }

  @Post(":clientId/assign-user")
  @ApiOperation({ description: 'Assign user to client' })
	@ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
	@ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
	@ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth()
  async assignUser(@GetUser() loggedInUser: User,@Param('clientId') clientId: number, @Body() assignUserDTO: AssignUserDTO) {
    this.utilService.validateLoggedInUser(loggedInUser);
    try{    
      const clientUserRoles = await this.clientService.getClientUserRolesForClient(loggedInUser,clientId);
      if(this.utilService.validateSuperAdminOrAdminForClient(clientUserRoles)){
        const client =  await this.clientService.findOne(clientId);
        const user = await this.userService.findOne(assignUserDTO.userId);
        const role =  await this.userRolesService.findOne(assignUserDTO.roleId);
        if (client && user && role){
          const response = await this.clientService.assignUser(user,client,role);
          if (response) return this.utilService.successResponseData(response);
        } 
        else this.utilService.badRequest(ResponseMessage.CLIENT_CREATION_FAILED);
      }else{
        this.utilService.unauthorized();
      }
    }catch(e){
      this.utilService.badRequest(e.message);
      // this.utilService.errorResponse(e);
    }

  }

  @Post('/client_user_roles')
  @ApiCreatedResponse({ description: 'Add user roles to client' })
  createClientUserRoles(
    @Body() body: CreateClientUserRolesDto,
  ): Observable<CreateClientUserRolesDto> {
    return this.userRolesService.createClientUserRoles(body);
  }

  @Get()
  async findAll() {
    return await this.clientService.findAll();
  }

  @Get(':id')
  @ApiOperation({ description: 'Get client by id' })
	@ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
	@ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
	@ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth()
  async findOne(@Param('id') clientId: number,@GetUser() loggedInUser:User) {
    try{
      const clientUserRoles = await this.clientService.getClientUserRolesForClient(loggedInUser,clientId);
      if(this.utilService.validateSuperAdminOrAdminForClient(clientUserRoles)){
        const response =  await this.clientService.findById(+clientId);
        if (response) return this.utilService.successResponseData(response);
      }else{
        this.utilService.unauthorized();
      }
    }catch(e){
      this.utilService.badRequest(e.message);
      // this.utilService.errorResponse(e);
    }

  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(+id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientService.remove(+id);
  }
}
