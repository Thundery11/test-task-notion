import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignInDto {
  @IsEmail()
  email: string;
  @Length(5, 25)
  password: string;
}
