/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import {
	Equals,
	IsArray,
	IsEmpty, IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Matches,
	ValidateNested,
	Length,
	IsBoolean
} from 'class-validator';

export class ResponseErrorMessage {
	@IsNumber()
	@ApiProperty()
	status: number;

	@IsString()
	@ApiProperty()
	message: string;
}


export class ResponseSuccessMessage {
	@IsString()
	@ApiProperty()
	response_code: string;

	@IsString()
	@ApiProperty()
	response_data: string;
}

export class ResponseBadRequestMessage {
	@IsNumber()
	@ApiProperty()
	status: number;

	@ApiProperty()
	errors: Array<string>;

}

export interface CommonResponseModel {
	response_code: number;
	response_data: any;
	extra?: string;
}

export enum ResponseMessage {
    CLIENT_CREATION_FAILED = 'Failed to create client',
	STORE_CREATION_FAILED = 'Failed to create store'
}