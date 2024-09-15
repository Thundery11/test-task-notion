import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Users } from '../../users/domain/user.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'timestamp' })
  publicationDate: Date;

  @Column()
  authorId: number;

  @ManyToOne(() => Users, (u) => u.articles)
  author: Users;
}
