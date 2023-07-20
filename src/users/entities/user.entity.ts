import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { RoleEntity } from 'src/roles/entities/role.entity';
import { DepartmentEntity } from 'src/departments/entities/department.entity';

export class UserEntity implements User {
    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }

    @ApiProperty()
    id: number;

    @ApiProperty()
    email: string;

    @ApiProperty()
    @Exclude()
    password: string;

    @ApiProperty()
    first_name: string;

    @ApiProperty()
    last_name: string;

    @ApiProperty()
    phone_number: string;

    @ApiProperty()
    profile_image: string;

    @ApiProperty()
    is_blocked: boolean;

    @ApiProperty()
    is_first_logged: boolean;

    @ApiProperty()
    designation: string;

    @ApiProperty()
    degrees: string;

    @ApiProperty()
    specialist: string;

    @ApiProperty()
    work_experience: number;

    @ApiProperty()
    service_place: string;

    @ApiProperty()
    birth_date: Date;

    @ApiProperty()
    refresh_token: string;

    @ApiProperty()
    department_id: number;

    @ApiProperty({ type: DepartmentEntity })
    department?: DepartmentEntity;

    @ApiProperty()
    role_id: number;

    @ApiProperty({ type: RoleEntity })
    role?: RoleEntity;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    // constructor({ department, ...data }: Partial<DepartmentEntity>) {
    //     Object.assign(this, data);

    //     if (department) {
    //       this.department = new UserEntity(department);
    //     }
    //   }
    // static create(partial: Partial<UserEntity>): UserEntity {
    //     return new UserEntity(partial, partial.department);
    // }
}
