import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Article } from '../domain/articles.entity';
import { CreateArticleDto } from '../api/dto/create-article.dto';
import { ArticlesRepository } from '../repository/articles.repository';
import { SortingQueryParams } from '../api/dto/sorting/sorting-query.dto';
import { AllArticlesOutputModel } from '../api/dto/output/articles.output.model';
import { UpdateArticleDto } from '../api/dto/udate-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    // @Inject('CACHE_MANAGER') private cacheManager: Cache,
    private articleRepository: ArticlesRepository,
  ) {}

  async addArticle(
    createArticleDto: CreateArticleDto,
    userId: number,
  ): Promise<Article> {
    const article = new Article();
    article.authorId = userId;
    article.title = createArticleDto.title;
    article.description = createArticleDto.description;
    article.publicationDate = new Date();

    return await this.articleRepository.save(article);
  }

  async getArticles(
    sortingParams: SortingQueryParams,
  ): Promise<AllArticlesOutputModel | null> {
    const {
      sortBy = 'publicationDate',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10,
    } = sortingParams;
    const skip = (pageNumber - 1) * pageSize;
    const countedDocuments = await this.articleRepository.countAllDocuments();
    const pagesCount: number = Math.ceil(countedDocuments / pageSize);
    const allArticles = await this.articleRepository.getAllArticles(
      sortBy,
      sortDirection,
      pageSize,
      skip,
    );
    const presentationalArticles = {
      pagesCount,
      page: Number(pageNumber),
      pageSize: Number(pageSize),
      totalCount: countedDocuments,
      items: allArticles,
    };

    return presentationalArticles;
  }

  async updateArticle(
    userId: number,
    articleId: number,
    updateArtilceDto: UpdateArticleDto,
  ): Promise<Article | null> {
    const article = await this.articleRepository.updateArticle(
      userId,
      articleId,
      updateArtilceDto,
    );
    if (!article) {
      throw new NotFoundException({
        message: 'article with current Id wasnt found',
      });
    }
    return article;
  }

  async deleteArticle(userId: number, articleId: number): Promise<boolean> {
    const isDeleted = await this.articleRepository.deleteArticle(
      userId,
      articleId,
    );
    if (!isDeleted) {
      throw new NotFoundException({
        message: 'article with current Id wasnt found',
      });
    }
    return isDeleted;
  }
}
