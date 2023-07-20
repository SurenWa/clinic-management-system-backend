import { ResetPasswordRequestDto } from './../users/dto/reset-password-request.dto';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
//import { UserEntity } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendUserConfirmation(user: CreateUserDto) {
        await this.mailerService.sendMail({
            to: user.email,
            // from: '"Support Team" <support@example.com>', // override default from
            subject: 'Welcome to Berry App! Confirm your Email',
            template: './createUser', // `.hbs` extension is appended automatically
            context: {
                // ✏️ filling curly brackets with content
                name: user.first_name,
                email: user.email,
                password: user.password,
            },
        });
    }

    async sendPasswordResetLink(
        user: string,
        email: ResetPasswordRequestDto['email'],
        link: string,
    ) {
        await this.mailerService.sendMail({
            to: email,
            // from: '"Support Team" <support@example.com>', // override default from
            subject: 'Berry App! Password reset link',
            template: './sendPasswordResetLink', // `.hbs` extension is appended automatically
            context: {
                // ✏️ filling curly brackets with content
                name: user,
                link: link,
            },
        });
    }
}
