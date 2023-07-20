import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDepartmentDto {
    @ApiProperty({
        type: String,
        description: 'Department name is required',
    })
    @IsString({ message: 'Department name must be string' })
    @IsNotEmpty({ message: 'Department name must not be empty' })
    department_name: string;
}
