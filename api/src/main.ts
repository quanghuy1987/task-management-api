import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          [error.property]: error?.constraints
            ? error.constraints[Object.keys(error.constraints)[0]]
            : '',
        }));
        return new BadRequestException(result);
      },
      stopAtFirstError: false,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
