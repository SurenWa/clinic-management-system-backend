import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { DepartmentEntity } from './entities/department.entity';

@Injectable()
export class DepartmentsService {
    constructor(private prisma: PrismaService) {}

    async create(
        createDepartmentDto: CreateDepartmentDto,
    ): Promise<{ message: string }> {
        const createDepartment = await this.prisma.department.create({
            data: createDepartmentDto,
        });
        if (!createDepartment) {
            throw new NotFoundException('Department creation denied');
        }

        // return createDepartment;
        return { message: 'Department created successfully' };
    }

    async findAll() {
        const departments = this.prisma.department.findMany();
        if (!departments) {
            throw new NotFoundException('Departments fetching denied');
        }
        return departments;
    }

    async findOne(id: number) {
        const department = await this.prisma.department.findUnique({
            where: { id },
        });
        if (!department) {
            throw new NotFoundException(
                `Department with ${id} does not exist.`,
            );
        }
        return department;
    }

    async update(
        id: number,
        updateDepartmentDto: UpdateDepartmentDto,
    ): Promise<{ message: string; department: DepartmentEntity }> {
        const updatedDepartment = await this.prisma.department.update({
            where: { id },
            data: updateDepartmentDto,
        });
        if (updatedDepartment === null) {
            throw new NotFoundException(
                `Department with ${id} cannot be updated.`,
            );
        }
        return {
            message: 'Department Updated Successfully',
            department: updatedDepartment,
        };
    }

    async remove(
        id: number,
    ): Promise<{ message: string; department: DepartmentEntity }> {
        const deletedDepartment = await this.prisma.department.delete({
            where: { id },
        });
        if (!deletedDepartment) {
            throw new NotFoundException(
                `Department with ${id} does not exists.`,
            );
        }
        return {
            message: 'Department deleted successfully',
            department: deletedDepartment,
        };
    }
}
