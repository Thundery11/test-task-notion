import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../domain/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AuthCredentialsDto } from '../../auth/api/dto/auth-credentials.dto';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepo: Repository<Users>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useClass: Repository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepo = module.get<Repository<Users>>(getRepositoryToken(Users));
  });

  describe('signUp', () => {
    it('should successfully sign up a user', async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        login: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(usersRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
      jest.spyOn(usersRepo, 'save').mockResolvedValue({} as Users);

      await usersService.signUp(authCredentialsDto);

      expect(usersRepo.findOne).toHaveBeenCalledWith({
        where: { email: authCredentialsDto.email },
      });
      expect(usersRepo.save).toHaveBeenCalled();
    });

    it('should throw a BadRequestException if user already exists', async () => {
      const authCredentialsDto: AuthCredentialsDto = {
        login: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(usersRepo, 'findOne').mockResolvedValue({} as Users);

      await expect(usersService.signUp(authCredentialsDto)).rejects.toThrow();
    });
  });

  describe('validateUser', () => {
    it('should return the user if password is valid', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const user = { email, passwordHash: 'hashedPassword' } as Users;

      jest.spyOn(usersRepo, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await usersService.validateUser(email, password);
      expect(result).toEqual(user);
    });

    it('should return null if password is invalid', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';
      const user = { email, passwordHash: 'hashedPassword' } as Users;

      jest.spyOn(usersRepo, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await usersService.validateUser(email, password);
      expect(result).toBeNull();
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password123';

      jest.spyOn(usersRepo, 'findOne').mockResolvedValue(null);

      await expect(
        usersService.validateUser(email, password),
      ).rejects.toThrow();
    });
  });
});
