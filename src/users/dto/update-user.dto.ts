import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsImageFile } from './custom-validator';
import { Express } from 'express';

export class UpdateUserDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    email: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString({ message: 'First name must be string' })
    first_name: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString({ message: 'Last name must be string' })
    last_name: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    phone_number: string;

    @ApiPropertyOptional({ type: 'string', format: 'binary' })
    @IsImageFile({ message: 'Invalid mime type received' })
    @IsOptional()
    profile_image: Express.Multer.File;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    designation: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    degrees: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    specialist: string;

    @ApiPropertyOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    @IsOptional()
    work_experience: number;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    service_place: string;

    @ApiPropertyOptional()
    @IsDateString()
    @IsOptional()
    @Transform(({ value }) => new Date(value).toISOString())
    birth_date: Date | null;
}
