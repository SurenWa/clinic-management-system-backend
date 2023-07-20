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
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentEntity } from './entities/department.entity';

@Controller('departments')
@ApiTags('departments')
export class DepartmentsController {
    constructor(private readonly departmentsService: DepartmentsService) {}

    @Post('/create-department')
    @ApiCreatedResponse()
    @ApiForbiddenResponse({ description: 'Unauthorized Request' })
    create(@Body() createDepartmentDto: CreateDepartmentDto) {
        return this.departmentsService.create(createDepartmentDto);
    }

    @Get('/get-all-departments')
    @ApiOkResponse({
        type: DepartmentEntity,
        isArray: true,
        description: 'Fetched departments successfully',
    })
    @ApiForbiddenResponse({ description: 'Unauthorized Request' })
    @ApiNotFoundResponse({ description: 'Resource Not Found' })
    findAll() {
        return this.departmentsService.findAll();
    }

    @Get('/get-single-department/:id')
    @ApiOkResponse({
        type: DepartmentEntity,
        description: 'Fetched department successfully',
    })
    @ApiForbiddenResponse({ description: 'Unauthorized Request' })
    @ApiNotFoundResponse({ description: 'Resource Not Found' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.departmentsService.findOne(id);
    }

    @Patch('/update-department/:id')
    @ApiOkResponse({
        type: DepartmentEntity,
        description: 'Department updated successfully',
    })
    @ApiForbiddenResponse({ description: 'Unauthorized Request' })
    @ApiNotFoundResponse({ description: 'Resource Not Found' })
    @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDepartmentDto: UpdateDepartmentDto,
    ) {
        return this.departmentsService.update(id, updateDepartmentDto);
    }

    @Delete('/delete-department/:id')
    @ApiOkResponse({
        type: DepartmentEntity,
        description: 'Deleted successfully',
    })
    @ApiForbiddenResponse({ description: 'Unauthorized Request' })
    @ApiNotFoundResponse({ description: 'Resource Not Found' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.departmentsService.remove(id);
    }
}
