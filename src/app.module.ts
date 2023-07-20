import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RolesModule } from './roles/roles.module';
import { DepartmentsModule } from './departments/departments.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';

@Module({
    imports: [
        CacheModule.registerAsync({
            isGlobal: true,
            useFactory: async () => ({
                store: await redisStore({
                    socket: {
                        host: 'localhost',
                        port: 6379,
                    },
                }),
            }),
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV}`,
        }),
        PrismaModule,
        RolesModule,
        DepartmentsModule,
        UsersModule,
        MailModule,
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_PIPE,
            useClass: ValidationPipe,
        },
        AppService,
    ],
})
export class AppModule {}
