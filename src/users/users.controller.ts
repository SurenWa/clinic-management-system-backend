import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    UseGuards,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiOkResponse,
    ApiTags,
    ApiForbiddenResponse,
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiUnprocessableEntityResponse,
    ApiConsumes,
    ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import {
    CreateUserDto,
    UpdateUserDto,
    ResetPasswordRequestDto,
    LoginDto,
    ResetPasswordDto,
    UpdatePasswordDto,
} from './dto';
import { JwtAuthGuard } from 'src/common/guards';
import { UserEntity, AuthEntity } from './entities';
//import { AuthGuard } from '@nestjs/passport';
import { GetCurrentUserId, GetCurrentUser } from 'src/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
@ApiTags('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('/create-user')
    @ApiCreatedResponse()
    @ApiForbiddenResponse({ description: 'Unauthorized Request' })
    create(@Body() createUserDto: CreateUserDto) {
        console.log(createUserDto);
        return this.usersService.create(createUserDto);
    }

    @Post('/login')
    @ApiOkResponse({ type: AuthEntity })
    login(@Body() loginDto: LoginDto) {
        return this.usersService.login(loginDto);
    }

    @Get('/current-user')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ type: UserEntity })
    async getUserProfile(
        @GetCurrentUserId() userId: number,
    ): Promise<UserEntity> {
        return this.usersService.findOne(userId);
    }

    @Post('/refresh-token')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    refreshTokens(
        @GetCurrentUserId() userId: number,
        @GetCurrentUser('refreshToken') refreshToken: string,
    ): Promise<AuthEntity> {
        return this.usersService.refreshTokens(userId, refreshToken);
    }

    @Post('/logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse()
    async logout(@GetCurrentUserId() userId: number): Promise<boolean> {
        return this.usersService.logout(userId);
    }

    @Get('/find-all-users')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ type: UserEntity, isArray: true })
    findAll() {
        return this.usersService.findAll();
    }

    @Get('/find-single-user/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ type: UserEntity })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOne(id);
    }

    @Patch('/update-user/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UpdateUserDto })
    @UseInterceptors(FileInterceptor('profile_image'))
    update(
        @GetCurrentUserId() userId: number,
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        updateUserDto.profile_image = file;
        return this.usersService.update(userId, id, file, updateUserDto);
    }

    @Delete('/delete-user/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ type: UserEntity })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.remove(id);
    }

    @Post('/password-reset-request')
    @ApiCreatedResponse()
    requestPasswordReset(
        @Body() resetPasswordRequestDto: ResetPasswordRequestDto,
    ) {
        return this.usersService.requestPasswordReset(resetPasswordRequestDto);
    }

    @Post('/password-reset')
    @ApiCreatedResponse()
    passwordReset(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.usersService.resetPassword(resetPasswordDto);
    }

    @Post('/update-password')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiCreatedResponse()
    async updatePassword(
        @GetCurrentUserId() userId: number,
        @Body() updatePasswordDto: UpdatePasswordDto,
    ) {
        return this.usersService.updatePassword(userId, updatePasswordDto);
    }
}
