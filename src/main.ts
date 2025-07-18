import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // Enable versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Security middleware
  app.use(helmet());
  app.enableCors();

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Star Wars API')
    .setDescription('The Star Wars API for managing characters')
    .setVersion('1.0')
    .addTag('characters')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap().catch((error) => {
  console.error(error);

  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error ❌');
  console.log(error);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception ❌');
  console.log(error);
});
