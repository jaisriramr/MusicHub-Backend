import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import { json, urlencoded } from 'express';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ limit: '5mb', extended: true }));
  app.use(cors());
  // Swagger documentation setup
  const config = new DocumentBuilder()
    .setTitle('MusicHub Engine')
    .setDescription('This is a music streaming engine')
    .setVersion('1.0')
    .addTag('MusicHub APIs')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();
