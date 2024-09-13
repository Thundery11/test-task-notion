import { Module } from '@nestjs/common';
import { AuthController } from '../api/auth.controller';
import { AuthService } from '../application/auth.service';
import { JwtStrategy } from '../api/strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { tokensLivesConstants } from '../common/constants/token-lives.constants';
import { UsersModule } from '../../users/users.module';
import { LocalStrategy } from '../api/strategies/local.strategy';
import * as dotenv from 'dotenv';

dotenv.config();
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      global: false,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: tokensLivesConstants['2hours'] },
    }),
  ],

  providers: [AuthService, JwtStrategy, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
