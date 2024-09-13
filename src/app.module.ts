import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth/module/auth.module';
dotenv.config();

const { PG_HOST, PG_PORT, PG_DB, PG_USER, PG_PASSWORD } = process.env;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: PG_HOST,
      port: +PG_PORT,
      username: PG_USER,
      password: PG_PASSWORD,
      database: PG_DB,
      autoLoadEntities: true,
      synchronize: false,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
