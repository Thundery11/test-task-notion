import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../../users/application/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from '../api/dto/auth-credentials.dto';
import { SignInDto } from '../api/dto/signIn.dto';
import { Users } from '../../users/domain/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            signUp: jest.fn(),
            validateUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockAccessToken'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signUp', () => {
    it('should call UsersService.signUp', async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        login: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      await authService.signUp(authCredentialsDto);
      expect(usersService.signUp).toHaveBeenCalledWith(authCredentialsDto);
    });
  });

  describe('signIn', () => {
    it('should return an access token if credentials are valid', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const user = { id: 1, email: signInDto.email };

      jest.spyOn(usersService, 'validateUser').mockResolvedValue(user as Users);

      const result = await authService.signIn(signInDto);
      expect(usersService.validateUser).toHaveBeenCalledWith(
        signInDto.email,
        signInDto.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: signInDto.email,
        sub: user.id,
      });
      expect(result).toEqual({ accessToken: 'mockAccessToken' });
    });

    it('should throw an error if user validation fails', async () => {
      const signInDto: SignInDto = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      };

      jest.spyOn(usersService, 'validateUser').mockResolvedValue(null);

      await expect(authService.signIn(signInDto)).rejects.toThrow();
    });
  });
});
