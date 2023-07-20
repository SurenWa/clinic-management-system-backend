import { Department } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class DepartmentEntity implements Department {
    @ApiProperty()
    id: number;

    @ApiProperty()
    department_name: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
