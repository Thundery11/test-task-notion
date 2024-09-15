import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './features/auth/module/auth.module';
import * as dotenv from 'dotenv';
import { ArticlesModule } from './features/articles/module/articles.module';
import { Article } from './features/articles/domain/articles.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ConfigModule } from '@nestjs/config';
import { Users } from './features/users/domain/user.entity';
import { UsersModule } from './features/users/users.module';
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
  synchronize: false,
  ssl: false,
};

@Module({
  imports: [
    TypeOrmModule.forRoot(dbOptions),
    TypeOrmModule.forFeature([Users, Article]),
    CacheModule.register({ isGlobal: true, ttl: 60 * 1000, store: redisStore }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    ArticlesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
