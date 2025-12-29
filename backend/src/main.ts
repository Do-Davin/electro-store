import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5137'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unknown fields
      forbidNonWhitelisted: true, // throws error if unknown field is sent
      transform: true, // auto-transform payloads to DTO classes
    }),
  );

  app.useStaticAssets(join(__dirname, '..', 'public'));

  // await app.listen(process.env.PORT ?? 3000);
  await app.listen(3000);
}
bootstrap();
