import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsUnique } from './IsUnique';

export class CreateRoleDto {
    @ApiProperty({
        type: String,
        description: 'Role name is required',
    })
    @IsString({ message: 'Role name must be string' })
    @IsNotEmpty({ message: 'Role name must not be empty' })
    @IsUnique({ message: 'Role name must be unique ' })
    role_name: string;
}
