/* eslint-disable prettier/prettier */
import { User } from '../../user/entities/user.entity';
import {
	IsNotEmpty,
	IsEmail,
	IsEmpty,
	IsUrl,
	IsNumber,
	Length,
	IsOptional,
	IsPositive,
	Min,
	Equals,
	IsArray,
	ValidateNested,
	IsString,
	Max,
	IsEnum,
	IsAlphanumeric,
	IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClientDto {
  @IsString()
	@ApiProperty()
  name: string;

  @IsString()
	@IsOptional()
	@ApiPropertyOptional()
  users: User[];
}
