/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { join } from 'path';
import { config } from 'dotenv';

// Bundled output lives at dist/apps/backend/main.js, so load the .env that sits
// at apps/backend/.env regardless of the process cwd.
config({ path: join(__dirname, '../../../apps/backend/.env') });

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('BuildWithAI API')
    .setDescription('Backend that turns a problem description into TRIZ and SCAMPER driven solutions')
    .setVersion('1.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, swaggerDocument);

  const port = process.env['PORT'] || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
  Logger.log(
    `📘 OpenAPI docs available at: http://localhost:${port}/${globalPrefix}/docs`,
  );
}

bootstrap();
