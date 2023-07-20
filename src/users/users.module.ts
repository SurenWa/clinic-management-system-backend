import { Module, forwardRef } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RolesModule } from 'src/roles/roles.module';
import { DepartmentsModule } from 'src/departments/departments.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';
import { TokenExpiryJob, TokenExpiryService } from './tokens';
import { MailModule } from 'src/mail/mail.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

export const jwtSecret = process.env.JWT_SECRET;

@Module({
    controllers: [UsersController],
    providers: [
        UsersService,
        AccessTokenStrategy,
        RefreshTokenStrategy,
        TokenExpiryJob,
        TokenExpiryService,
    ],
    imports: [
        PrismaModule,
        PassportModule,
        ScheduleModule.forRoot(),
        JwtModule.register({
            secret: jwtSecret,
            signOptions: { expiresIn: '1h' }, // e.g. 30s, 7d, 24h
        }),
        RolesModule,
        DepartmentsModule,
        CloudinaryModule,
        forwardRef(() => MailModule),
    ],
})
export class UsersModule {}
