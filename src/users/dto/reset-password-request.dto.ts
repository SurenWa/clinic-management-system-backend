import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordRequestDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Email is required' })
    @IsString({ message: 'Email must be string' })
    email: string;
}
