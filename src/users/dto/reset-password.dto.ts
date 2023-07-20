import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class ResetPasswordDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Token is required' })
    @IsString({ message: 'Token must be string' })
    token: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'User id is required' })
    @IsNumber()
    userId: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be string' })
    password: string;
}
