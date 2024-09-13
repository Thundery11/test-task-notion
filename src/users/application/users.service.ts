import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthCredentialsDto } from '../../auth/api/dto/auth-credentials.dto';
import { Users } from '../domain/user.entity';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import e from 'express';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) private usersRepo: Repository<Users>) {}
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<Users> {
    try {
      const { login, email, password } = authCredentialsDto;

      const isExistUser = await this.usersRepo.findOne({
        where: { email: email },
      });
      if (isExistUser) {
        throw new BadRequestException({
          message: 'user with this email already registered',
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = Users.addUser(authCredentialsDto, hashedPassword);

      return await this.usersRepo.save(user);
    } catch (e) {
      throw new Error(e);
    }
  }

  async validateUser(email: string, password: string): Promise<Users | null> {
    try {
      const user = await this.usersRepo.findOne({ where: { email: email } });
      if (!user) {
        throw new NotFoundException({ message: 'user not found' });
      }
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      console.log(
        '🚀 ~ UsersService ~ validateUser ~ isValidPassword:',
        isValidPassword,
      );
      if (!isValidPassword) {
        return null;
      }
      return user;
    } catch (e) {
      throw new Error(e);
    }
  }
}
