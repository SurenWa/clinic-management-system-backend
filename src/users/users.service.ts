import { Prisma, User } from '@prisma/client';
import { UserEntity } from './entities/user.entity';
import {
    Injectable,
    HttpException,
    HttpStatus,
    NotFoundException,
    UnauthorizedException,
    ForbiddenException,
    BadRequestException,
    NotAcceptableException,
} from '@nestjs/common';
import {
    CreateUserDto,
    LoginDto,
    UpdateUserDto,
    ResetPasswordRequestDto,
    ResetPasswordDto,
    UpdatePasswordDto,
} from './dto';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { AuthEntity, JwtPayload } from './entities';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role, Department } from '@prisma/client';
import { MailService } from 'src/mail/mail.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import * as argon from 'argon2';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private mailService: MailService,
        private cloudinaryService: CloudinaryService,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<any> {
        const { email, password } = createUserDto;

        const emailExists = await this.prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (emailExists) {
            throw new HttpException('Email is taken', HttpStatus.BAD_REQUEST);
        }

        const hashedPassword = await argon.hash(password);

        const isFirstUser = (await this.prisma.user.count()) === 0;

        let firstRole: Role;
        let firstDepartment: Department;

        if (isFirstUser) {
            firstRole = await this.prisma.role.create({
                data: { role_name: 'ADMIN' },
            });
            firstDepartment = await this.prisma.department.create({
                data: { department_name: 'MANAGEMENT' },
            });

            await this.prisma.user.create({
                data: {
                    ...createUserDto,
                    password: hashedPassword,
                    role_id: firstRole.id,
                    department_id: firstDepartment.id,
                },
            });

            return {
                message: 'User created successfully',
            };

            // const tokens = await this.getTokens(user.id, user.email);
            // await this.updateRtHash(user.id, tokens.refresh_token);

            // return tokens;
        } else {
            await this.prisma.user.create({
                data: {
                    ...createUserDto,
                    password: hashedPassword,
                },
            });

            await this.mailService.sendUserConfirmation(createUserDto);

            // return new UserEntity(user1);

            return {
                message: 'User created and email sent successfully',
            };
        }
    }

    async login(loginDto: LoginDto): Promise<AuthEntity> {
        const { email, password } = loginDto;

        // Step 1: Fetch a user with the given email
        const user = await this.prisma.user.findUnique({
            where: { email: email },
        });

        // If no user is found, throw an error
        if (!user) {
            throw new NotFoundException(`No user found for email: ${email}`);
        }

        // Step 2: Check if the password is correct
        const isPasswordValid = await argon.verify(user.password, password);

        // If password does not match, throw an error
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        // Step 3: Generate a JWT containing the user's ID and return it
        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRtHash(user.id, tokens.refresh_token);

        return tokens;
    }

    async logout(userId: number): Promise<boolean> {
        try {
            await this.prisma.user.updateMany({
                where: {
                    id: userId,
                    refresh_token: {
                        not: null,
                    },
                },
                data: {
                    refresh_token: null,
                },
            });
            return true;
        } catch (error) {
            throw new BadRequestException('Logout failed');
        }
    }

    async requestPasswordReset(
        resetPasswordRequestDto: ResetPasswordRequestDto,
    ): Promise<{ message: string }> {
        const { email } = resetPasswordRequestDto;
        const user = await this.prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            throw new NotFoundException('Please enter correct email address');
        }

        const token = await this.prisma.token.findFirst({
            where: {
                user_id: user.id,
            },
        });

        if (token) {
            await this.prisma.token.delete({
                where: {
                    id: token.id,
                },
            });
        }

        const resetToken = randomBytes(32).toString('hex');

        const hash = await argon.hash(resetToken);

        await this.prisma.token.create({
            data: {
                user_id: user.id,
                token: hash,
                createdAt: new Date(),
            },
        });

        const link = `${process.env.CLIENT_URL}/passwordReset?token=${resetToken}&id=${user.id}`;
        //console.log(link);
        await this.mailService.sendPasswordResetLink(
            user.first_name,
            email,
            link,
        );
        // return link;
        return {
            message: 'Successfully sent password reset link is  to your email.',
        };
    }

    async resetPassword(
        resetPasswordDto: ResetPasswordDto,
    ): Promise<{ message: string }> {
        const { token, userId, password } = resetPasswordDto;

        const passwordResetToken = await this.prisma.token.findFirst({
            where: { user_id: userId },
        });

        if (!passwordResetToken) {
            throw new Error(
                'Invalid or expired password reset token.Please try again',
            );
        }

        const isValid = await argon.verify(passwordResetToken.token, token);

        if (!isValid) {
            throw new Error(
                'Invalid or expired password reset token.Please try again',
            );
        }

        const hashedPassword = await argon.hash(password);

        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                password: hashedPassword,
            },
        });

        return { message: 'Password updated successfully' };
    }

    async updatePassword(
        userId: number,
        updatePasswordDto: UpdatePasswordDto,
    ): Promise<{ message: string }> {
        //console.log(`${userId}`);
        const { oldPassword, newPassword } = updatePasswordDto;

        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new NotFoundException('Invalid user');
        }

        const isValidPassword = await argon.verify(user.password, oldPassword);

        if (!isValidPassword) {
            throw new NotAcceptableException('Invalid current password');
        }

        const isSamePassword = await argon.verify(user.password, newPassword);
        if (isSamePassword) {
            throw new NotAcceptableException(
                'Old Password and new password must be different',
            );
        }

        const newHashedPassword = await argon.hash(newPassword);

        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                password: newHashedPassword,
            },
        });

        return { message: 'Password updated successfully' };
    }

    async findAll() {
        const users = await this.prisma.user.findMany({
            include: {
                department: true,
                role: true,
            },
        });
        return users.map((user) => new UserEntity(user));
    }

    async findOne(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: id },
            include: {
                department: true,
                role: true,
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        return new UserEntity(user);
    }

    async update(
        userId: number,
        id: number,
        file: Express.Multer.File,
        updateUserDto: UpdateUserDto,
    ): Promise<{ message: string }> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User does not exist.');
        }

        if (user.id !== id) {
            throw new UnauthorizedException(
                'You are not authorized to update this profile',
            );
        }

        // Retrieve the existing profile_image URL from the database
        const previousProfileImageUrl = user.profile_image;

        if (updateUserDto.profile_image) {
            const newProfileImageUrl = await this.cloudinaryService.uploadFile(
                file,
            );
            updateUserDto.profile_image = newProfileImageUrl.secure_url;
            // Update the profile_image property in updateUserDto
        }

        // Remove properties with undefined values from updateUserDto using Object.assign()
        const filteredUpdateUserDto: Partial<UpdateUserDto> = Object.assign(
            {},
            updateUserDto,
        );

        const data: Prisma.UserUpdateInput = {};
        for (const key in filteredUpdateUserDto) {
            if (
                filteredUpdateUserDto.hasOwnProperty(key) &&
                filteredUpdateUserDto[key] !== undefined
            ) {
                // Assign the filtered properties to the data object
                data[key] = filteredUpdateUserDto[key];
            }
        }

        // Update the user with only the provided fields from the filteredUpdateUserDto
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: data,
        });

        //console.log(updatedProfile);
        // Delete the previous file from Cloudinary if it exists
        if (previousProfileImageUrl) {
            await this.cloudinaryService.deleteFileByUrl(
                previousProfileImageUrl,
            );
        }

        return { message: 'Profile updated successfully' };
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }

    async refreshTokens(userId: number, rt: string): Promise<AuthEntity> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user || !user.refresh_token)
            throw new ForbiddenException('Access Denied');

        const rtMatches = await argon.verify(user.refresh_token, rt);
        if (!rtMatches) throw new ForbiddenException('Access Denied');

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRtHash(user.id, tokens.refresh_token);

        return tokens;
    }

    async updateRtHash(userId: number, rt: string): Promise<void> {
        const hash = await argon.hash(rt);
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                refresh_token: hash,
            },
        });
    }

    async getTokens(userId: number, email: string): Promise<AuthEntity> {
        const jwtPayload: JwtPayload = {
            id: userId,
            email: email,
        };

        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(jwtPayload, {
                secret: process.env.JWT_SECRET,
                expiresIn: '1d',
            }),
            this.jwtService.signAsync(jwtPayload, {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '7d',
            }),
        ]);

        return {
            access_token: at,
            refresh_token: rt,
        };
    }
}
