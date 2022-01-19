/* eslint-disable prettier/prettier */
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
import { User } from '../../user/entities/user.entity';
export class UserDTO {
  @IsNumber()
  @ApiProperty()
  id: number;  

  @IsString()
  @ApiProperty()
  name: string;
}
