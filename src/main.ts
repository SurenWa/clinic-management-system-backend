import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: true,
    });
    app.enableCors();
    app.use(helmet());
    app.setGlobalPrefix('api/v1'); // Set the global prefix here
    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, forbidUnknownValues: false }),
    );
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
    );
    const config = new DocumentBuilder()
        .setTitle('Clinic Management System')
        .setDescription('Clinic Management System API description')
        .setVersion('0.1')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    await app.listen(5000);
}
bootstrap();
