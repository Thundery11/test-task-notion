import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './auth/module/auth.module';
import { UsersModule } from './users/users.module';
import * as dotenv from 'dotenv';
import { Users } from './users/domain/user.entity';

dotenv.config();
const { PG_HOST, PG_PORT, PG_DB, PG_USER, PG_PASSWORD } = process.env;

const dbOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: PG_HOST,
  port: +PG_PORT,
  username: PG_USER,
  password: PG_PASSWORD,
  database: PG_DB,
  autoLoadEntities: true,
  synchronize: true,
  ssl: false,
};
@Module({
  imports: [
    TypeOrmModule.forRoot(dbOptions),
    TypeOrmModule.forFeature([Users]),
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
