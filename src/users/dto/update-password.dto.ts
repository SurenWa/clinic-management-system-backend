import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be string' })
    oldPassword: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'New Password is required' })
    @IsString({ message: 'New Password must be string' })
    newPassword: string;
}
