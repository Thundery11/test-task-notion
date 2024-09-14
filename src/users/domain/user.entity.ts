import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AuthCredentialsDto } from '../../auth/api/dto/auth-credentials.dto';
import { use } from 'passport';
import { Article } from '../../articles/domain/articles.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  login: string;
  @Column()
  email: string;
  @Column()
  passwordHash: string;
  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  static addUser(
    authCredentialsDto: AuthCredentialsDto,
    hashedPassword: string,
  ) {
    const user = new Users();
    user.email = authCredentialsDto.email;
    user.login = authCredentialsDto.login;
    user.passwordHash = hashedPassword;
    return user;
  }
}
