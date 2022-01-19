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
export class CreateStoreDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsNumber()
  @ApiProperty()
  clientId: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  users: User[];
}
