import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsString,
    IsOptional,
} from 'class-validator';
import { IsImageFile } from './custom-validator';

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Email is required' })
    @IsString({ message: 'Email must be string' })
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be string' })
    password: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'First name is required' })
    @IsString({ message: 'First name must be string' })
    first_name: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Last name is required' })
    @IsString({ message: 'Last name must be string' })
    last_name: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    phone_number: string;

    @ApiProperty()
    @IsImageFile({ message: 'Invalid mime type received' })
    @IsOptional()
    profile_image: string;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    is_blocked: boolean;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    is_first_logged: boolean;

    @ApiProperty()
    @IsString()
    @IsOptional()
    designation: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    degrees: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    specialist: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    work_experience: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    service_place: string;

    @ApiProperty()
    @IsDateString()
    @IsOptional()
    birth_date: Date;

    @ApiProperty()
    @IsString()
    @IsOptional()
    refresh_token: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    department_id: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    role_id: number;
}
