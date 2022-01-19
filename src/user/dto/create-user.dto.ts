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
import { ApiPropertyOptional,ApiProperty} from '@nestjs/swagger';
export class CreateUserDto {
  @IsString()
	@IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
	@IsNotEmpty()
	@Length(5, 35)
	@ApiProperty()
	password: string;

  salt: string;
}
