import { Module } from '@nestjs/common';
import { UsersService } from './application/users.service';
import { Users } from './domain/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
