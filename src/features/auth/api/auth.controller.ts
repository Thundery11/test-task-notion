import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from '../application/auth.service';
import { LocalAuthGuard } from '../guards/local.auth.guard';
import { SignInDto } from './dto/signIn.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return await this.authService.signUp(authCredentialsDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  async signIn(@Body() signInDto: SignInDto): Promise<{ accessToken: string }> {
    return await this.authService.signIn(signInDto);
  }
}
