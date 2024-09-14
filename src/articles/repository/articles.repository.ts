import { Injectable } from '@nestjs/common';
import { Article } from '../domain/articles.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateArticleDto } from '../api/dto/udate-article.dto';

@Injectable()
export class ArticlesRepository {
  constructor(
    @InjectRepository(Article) private articleRepo: Repository<Article>,
  ) {}

  async save(article: Article): Promise<Article> {
    try {
      return await this.articleRepo.save(article);
    } catch (e) {
      throw new Error(e);
    }
  }

  async countAllDocuments(): Promise<number> {
    try {
      const count = await this.articleRepo.count();
      return Number(count);
    } catch (e) {
      throw new Error(e);
    }
  }

  async getAllArticles(
    sortBy: string,
    sortDirection: string,
    pageSize: number,
    skip: number,
  ): Promise<Article[]> {
    try {
      const articles = await this.articleRepo
        .createQueryBuilder('article')
        .select(['article'])
        .orderBy(`article.${sortBy}`, sortDirection === 'asc' ? 'ASC' : 'DESC')
        .skip(skip)
        .take(pageSize)
        .getMany();
      return articles;
    } catch (e) {
      throw e;
    }
  }

  async updateArticle(
    userId: number,
    articleId: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article | null> {
    try {
      const article = await this.articleRepo.findOne({
        where: { id: articleId, authorId: userId },
      });
      if (!article) {
        return null;
      }
      article.description = updateArticleDto.description;
      article.title = updateArticleDto.title;
      return await this.articleRepo.save(article);
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteArticle(userId: number, articleId: number): Promise<boolean> {
    try {
      const result = await this.articleRepo.delete({
        authorId: userId,
        id: articleId,
      });
      return result.affected === 1 ? true : false;
    } catch (e) {
      throw new Error(e);
    }
  }
}
