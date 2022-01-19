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
export class AssignUserDTO {
  @IsNumber()
  @ApiProperty()
  userId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  clientId: number;

  @IsString()
  @IsNumber()
  @ApiProperty()
  roleId: number;
}
