/* eslint-disable prettier/prettier */
import {
    BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientUserRole } from 'src/client/entities/client_user-roles.entity';
import { StoreUserRole } from 'src/store/entities/store_user_roles.entity';
import { UserRoleType } from 'src/user-roles/dto/user-role.enum';
import { UserRole } from 'src/user-roles/entities/user-role.entity';


@Injectable()
export class UtilService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public unauthorized() {
    const msg = 'UNAUTHORIZED';
    throw new UnauthorizedException(msg);
  }

  public badRequest(key?) {
    const msg = key;
    throw new BadRequestException(msg);
}

private async res(responseCode, responseData?, key?) {
    let message = "";
    if (responseData) {
        message = responseData;
    }

    message = message || key;
    return {
        response_code: responseCode,
        response_data: message
    }
}

public async successResponseData(responseData, extra?) {
    if (!extra) return await this.res(HttpStatus.OK, responseData);
    const res = await this.res(HttpStatus.OK, responseData);
    for (const key in extra) res[key] = extra[key];
    return res;
}

public validateLoggedInUser(user) {
    if(!user) throw new NotFoundException('logged in user not found');
}

public validateSuperAdmin(clientRoles: ClientUserRole[]): boolean{
    console.log('AclientRoles',clientRoles);
    const accessRole = clientRoles.find(s => s.userRole.name === UserRoleType.SUPER_ADMIN.toString());
    if(!accessRole){
        return false;
    }
    return true;
}

public validateSuperAdminOrAdminForClient(clientRoles: ClientUserRole[]): boolean{
    const accessRole = clientRoles.find(s => s.userRole.name === UserRoleType.SUPER_ADMIN.toString() || s.userRole.name === UserRoleType.ADMIN.toString());
    if(!accessRole){
        return false;
    }
    return true;
}

public validateManagerOrStaffForStore(storeRoles: StoreUserRole[]){
    console.log('BstoreRoles',storeRoles);
    const accessRole = storeRoles.find(s => s.userRole.name === UserRoleType.MANAGER.toString() || s.userRole.name === UserRoleType.STAFF.toString());
    if(!accessRole){
        return false;
    }
    return false;
}

public errorResponse(e) {
    console.log(e);
    if (e.message && e.message.statusCode == HttpStatus.BAD_REQUEST) {
        throw new BadRequestException(e.message);
    }
    if (e.message && e.message.statusCode == HttpStatus.NOT_FOUND) {
        throw new NotFoundException(e.message.message);
    }
    // if(e.kind === 'ObjectId' && e.path === '_id') {
    //     throw new NotFoundException('NOT_FOUND');
    // } else
    //     throw new NotFoundException("NOT_FOUND")
    //   throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    //return await this.res(HttpStatus.INTERNAL_SERVER_ERROR, "", key);
    //console.log(e.kind);
}
}
