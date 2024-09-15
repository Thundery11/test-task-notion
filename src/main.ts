import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { appSettings } from './settings/app-settings';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appSettings(app);
  const port = process.env.PORT || 3003;
  await app.listen(port);
  console.log(port);
}
bootstrap();
