import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';
import { AppModule } from '../app.module';
import { HttpExceptionFilter } from '../infrastructure/exception-filters.ts/exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const appSettings = (app) => {
  app.enableCors();
  app.use(cookieParser());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      exceptionFactory: (errors) => {
        console.log(errors);
        const errorsForResponse: { message: string; field: string }[] = [];
        errors.forEach((e) => {
          const constraintsKeys = Object.keys(e.constraints!);
          constraintsKeys.forEach((cKey) => {
            errorsForResponse.push({
              message: e.constraints![cKey],
              field: e.property,
            });
          });
        });
        throw new BadRequestException(errorsForResponse);
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('Test task notion')
    .setDescription('Test task notion API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const options = {
    swaggerOptions: {},
  };

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, options);
};
