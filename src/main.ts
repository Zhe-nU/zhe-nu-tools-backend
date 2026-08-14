import './instrument';

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { cleanupOpenApiDoc } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  app.enableShutdownHooks();

  app.enableCors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setOpenAPIVersion('3.2.0')
    .setTitle('Zhe_nU Tools API')
    .setDescription('API for Zhe_nU Tools')
    .setVersion('1.0')
    .addTag('Bot', 'Операции, связанные с ботом', undefined, { kind: 'nav' })
    .addTag('Schedule', 'Операции, связанные с расписанием', undefined, {
      kind: 'nav',
    })
    .addTag(
      'ScheduleItem',
      'Операции, связанные с записями в расписании',
      undefined,
      {
        parent: 'Schedule',
      },
    )
    .addGlobalResponse({
      status: 400,
      description: 'Клиент отправил невалидные данные',
    })
    .addGlobalResponse({
      status: 404,
      description: 'Не найдено',
    })
    .addGlobalResponse({
      status: 500,
      description: 'Внутрення ошибка сервера',
    })
    .build();
  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, cleanupOpenApiDoc(documentFactory));

  app.use(
    '/docs',
    apiReference({
      content: documentFactory,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
