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
export class LoginDTO {

	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	name: string;

	@ApiProperty()
	@IsNotEmpty()
	@Length(6, 35)
	@IsString()
	password: string;
}