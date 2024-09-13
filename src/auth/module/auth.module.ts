import { Module } from '@nestjs/common';
import { AuthController } from '../api/auth.controller';
import { AuthService } from '../application/auth.service';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
