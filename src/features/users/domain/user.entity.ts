import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from '../../articles/domain/articles.entity';
import { AuthCredentialsDto } from '../../auth/api/dto/auth-credentials.dto';

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
  @OneToMany(() => Article, (article) => article.author) //отношение один ко многим
  articles: Article[];

  static addUser(
    //статический метод для добавления юзера
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
