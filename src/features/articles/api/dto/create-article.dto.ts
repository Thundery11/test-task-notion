import { IsString, Length } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @Length(4, 50)
  title: string;

  @IsString()
  @Length(10, 500)
  description: string;
}
