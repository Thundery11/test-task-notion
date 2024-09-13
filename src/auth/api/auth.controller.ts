import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from '../application/auth.service';
import { LocalAuthGuard } from '../guards/local.auth.guard';
import { SignInDto } from './dto/signIn.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  signIn(@Body() signInDto: SignInDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(signInDto);
  }
}
