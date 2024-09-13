import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  login: string;
  @IsEmail()
  email: string;
  @Length(5, 25)
  password: string;
}
