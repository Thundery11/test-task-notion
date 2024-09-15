import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from '../api/dto/auth-credentials.dto';
import { UsersService } from '../../users/application/users.service';
import { Users } from '../../users/domain/user.entity';
import { SignInDto } from '../api/dto/signIn.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    await this.usersService.signUp(authCredentialsDto);
  }

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    const { email, password } = signInDto;
    const user = await this.validateUser(email, password); // Метод проверки пользователя
    const payload = { email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async validateUser(email: string, password: string): Promise<Users | null> {
    return await this.usersService.validateUser(email, password);
  }
}
