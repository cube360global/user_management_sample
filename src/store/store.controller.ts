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
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { UserRolesService } from '../user-roles/user-roles.service';
import { CreateStoreUserRolesDto } from './dto/create-store-user-roles.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { User } from '../user/entities/user.entity';
import { ResponseBadRequestMessage, ResponseErrorMessage, ResponseMessage, ResponseSuccessMessage } from '../utils/app.model';
import { GetUser } from '../utils/jwt.strategy';
import { AuthGuard } from '@nestjs/passport';
import { UtilService } from '../utils/util.service';
import { ClientService } from '../client/client.service';
import { Store } from './entities/store.entity';
import { AssignUserToStoreDTO } from './dto/assign-user-store.dto';
import { UserService } from '../user/user.service';

@Controller(':clientId/stores')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private userRolesService: UserRolesService,
    private utilService: UtilService,
    @Inject(forwardRef(() => ClientService))
    private clientService: ClientService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService
    
  ) {}

  @Post()
  @ApiOperation({ description: 'Create store' })
	@ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
	@ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
	@ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth()
  async create(@GetUser() loggedInUser: User,@Param('clientId') clientId:number, @Body() createStoreDto: CreateStoreDto) {
    this.utilService.validateLoggedInUser(loggedInUser);
    try{    
      const clientUserRoles = await this.clientService.getClientUserRolesForClient(loggedInUser,clientId);
      if(!this.utilService.validateSuperAdmin(clientUserRoles)){
        this.utilService.unauthorized();
      }
      const client = await this.clientService.findOne(clientId);
      if(!client){
        throw new BadRequestException('invalid client');
      }
      const storeToSave: Store = {
        client: client,
        name: createStoreDto.name,
        id: 0,
        users: []
      }
      const response =  await this.storeService.create(storeToSave);
      if (response) return this.utilService.successResponseData(response);
      else this.utilService.badRequest(ResponseMessage.CLIENT_CREATION_FAILED);
    }catch(e){
      this.utilService.badRequest(e.message);
      // this.utilService.errorResponse(e);
    }
  }

  @Post(":storeId/assign-user")
  @ApiOperation({ description: 'Assign user to client' })
	@ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
	@ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
	@ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth()
  async assignUser(@GetUser() loggedInUser: User,@Param('clientId') clientId:number, @Param('storeId') storeId: number,@Body() assignUserToStoreDTO: AssignUserToStoreDTO) {
    this.utilService.validateLoggedInUser(loggedInUser);
    try{
      const clientUserRoles = await this.clientService.getClientUserRolesForClient(loggedInUser,clientId);
      if(!this.utilService.validateSuperAdmin(clientUserRoles)){
        const storeUserRoles = await this.storeService.getStoreUserRolesForUser(loggedInUser,null);
        if(!this.utilService.validateManagerOrStaffForStore(storeUserRoles)){
          this.utilService.unauthorized();
        }
      }

      const store = await this.storeService.findOne(storeId);
      const user = await this.userService.findOneForStore(assignUserToStoreDTO.userId);
      const role =  await this.userRolesService.findOne(assignUserToStoreDTO.roleId);

      if(!store){
        throw new BadRequestException('Could not found store');
      }
      if(!user){
        throw new BadRequestException('Could not found user');
      }
      if(!role){
        throw new BadRequestException('Could not found role');
      }

      return await this.storeService.assignUser(user,store,role);

    }catch(e){
      this.utilService.badRequest(e.message);
      // this.utilService.errorResponse(e);
    }

  }

  @Post('/store_user_roles')
  @ApiCreatedResponse({ description: 'add user roles to store' })
  createStoreUserRoles(
    @Body() body: CreateStoreUserRolesDto,
  ): Observable<CreateStoreUserRolesDto> {
    return this.userRolesService.createStoreUserRoles(body);
  }

  @Get()
  @ApiOperation({ description: 'Get stores of client' })
	@ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
	@ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
	@ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth()
  async findAll(@GetUser() loggedInUser: User, @Param('clientId') clientId: number) {
    try{
      const clientUserRoles = await this.clientService.getClientUserRolesForClient(loggedInUser,clientId);
      if(!this.utilService.validateSuperAdmin(clientUserRoles)){
        this.utilService.unauthorized();
      }
      const response =  await this.storeService.findAll();
      if (response) return this.utilService.successResponseData(response);
    }catch(e){
      this.utilService.badRequest(e.message);
    }
  }

  @Get(':id')
  @ApiOperation({ description: 'Get store of client by id' })
	@ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
	@ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
	@ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
	@UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') storeId: number,@GetUser() loggedInUser: User,@Param('clientId') clientId: number) {
    try{
      const clientUserRoles = await this.clientService.getClientUserRolesForClient(loggedInUser,clientId);
      if(!this.utilService.validateSuperAdmin(clientUserRoles)){
        const storeUserRoles = await this.storeService.getStoreUserRolesForUser(loggedInUser,storeId);
        if(!this.utilService.validateManagerOrStaffForStore(storeUserRoles)){
          this.utilService.unauthorized();
        }
      }

      const response = await this.storeService.findById(+storeId);
      if (response) return this.utilService.successResponseData(response);
    }catch(e){
      this.utilService.badRequest(e.message);
    }

  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.update(+id, updateStoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeService.remove(+id);
  }
}
