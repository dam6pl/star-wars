import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { setupSwagger } from './utils/setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // Enable versioning
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // Security middleware
  app.use(helmet());
  app.enableCors();

  // Swagger documentation
  setupSwagger(app);

  await app.listen(process.env.PORT || 3000);
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
