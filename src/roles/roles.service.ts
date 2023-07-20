import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class RolesService {
    constructor(private prisma: PrismaService) {}

    async create(createRoleDto: CreateRoleDto): Promise<{ message: string }> {
        const createRole = await this.prisma.role.create({
            data: createRoleDto,
        });
        if (!createRole) {
            throw new NotFoundException('Role creation denied');
        }

        // return createRole;
        return { message: 'Role created successfully' };
    }

    async findAll() {
        const roles = this.prisma.role.findMany();
        if (!roles) {
            throw new NotFoundException('Roles fetching denied');
        }
        return roles;
    }

    async findOne(id: number) {
        const role = await this.prisma.role.findUnique({
            where: { id },
        });
        if (!role) {
            throw new NotFoundException(`Role with ${id} does not exist.`);
        }
        return role;
    }

    async update(
        id: number,
        updateRoleDto: UpdateRoleDto,
    ): Promise<{ message: string; role: RoleEntity }> {
        const updatedRole = await this.prisma.role.update({
            where: { id },
            data: updateRoleDto,
        });
        if (updatedRole === null) {
            throw new NotFoundException(`Role with ${id} cannot be updated.`);
        }
        return { message: 'Role Updated Successfully', role: updatedRole };
    }

    async remove(id: number): Promise<{ message: string; role: RoleEntity }> {
        const deletedRole = await this.prisma.role.delete({ where: { id } });
        if (!deletedRole) {
            throw new NotFoundException(`Role with ${id} does not exists.`);
        }
        return { message: 'Role deleted successfully', role: deletedRole };
    }
}
