import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
} from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiOkResponse,
    ApiTags,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from './entities/role.entity';

@Controller('roles')
@ApiTags('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    @Post('/create-role')
    @ApiCreatedResponse()
    @ApiForbiddenResponse({ description: 'Unauthorized Request' })
    create(@Body() createRoleDto: CreateRoleDto) {
        return this.rolesService.create(createRoleDto);
    }

    @Get('/get-all-roles')
    @ApiOkResponse({
        type: RoleEntity,
        isArray: true,
        description: 'Fetched roles successfully',
    })
    @ApiForbiddenResponse({ description: 'Unauthorized Request' })
    @ApiNotFoundResponse({ description: 'Resource Not Found' })
    findAll() {
        return this.rolesService.findAll();
    }

    @Get('/get-single-role/:id')
    @ApiOkResponse({
        type: RoleEntity,
        description: 'Fetched role successfully',
    })
    @ApiForbiddenResponse({ description: 'Unauthorized Request' })
    @ApiNotFoundResponse({ description: 'Resource Not Found' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.rolesService.findOne(id);
    }

    @Patch('/update-role/:id')
    @ApiOkResponse({
        type: RoleEntity,
        description: 'Role updated successfully',
    })
    @ApiForbiddenResponse({ description: 'Unauthorized Request' })
    @ApiNotFoundResponse({ description: 'Resource Not Found' })
    @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateRoleDto: UpdateRoleDto,
    ) {
        return this.rolesService.update(id, updateRoleDto);
    }

    @Delete('/delete-role/:id')
    @ApiOkResponse({
        type: RoleEntity,
        description: 'Deleted successfully',
    })
    @ApiForbiddenResponse({ description: 'Unauthorized Request' })
    @ApiNotFoundResponse({ description: 'Resource Not Found' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.rolesService.remove(id);
    }
}
