import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Article } from '../domain/articles.entity';
import { CreateArticleDto } from '../api/dto/create-article.dto';
import { ArticlesRepository } from '../repository/articles.repository';
import { SortingQueryParams } from '../api/dto/sorting/sorting-query.dto';
import { AllArticlesOutputModel } from '../api/dto/output/articles.output.model';
import { UpdateArticleDto } from '../api/dto/udate-article.dto';
import { Cache } from 'cache-manager';
import { Paginator } from '../../../infrastructure/helpers/paginator';
@Injectable()
export class ArticlesService {
  constructor(
    @Inject('CACHE_MANAGER') private cacheManager: Cache,
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

    const addedArticle = await this.articleRepository.save(article); //сохраняем в бд

    // Инвалидация кэша после добавления новой статьи
    await this.cacheManager.del('all_articles');
    return addedArticle;
  }

  async getArticles(
    sortingParams: SortingQueryParams,
  ): Promise<AllArticlesOutputModel | null> {
    const cacheKey = 'all_articles'; // Ключ кэша для списка всех статей

    // Проверка наличия кэша
    const cachedArticles =
      await this.cacheManager.get<AllArticlesOutputModel>(cacheKey);
    if (cachedArticles) {
      return cachedArticles;
    }
    const {
      sortBy = 'publicationDate',
      sortDirection = 'desc',
      pageNumber = 1,
      pageSize = 10,
    } = sortingParams;

    const skip = (pageNumber - 1) * pageSize;
    const countedDocuments = await this.articleRepository.countAllDocuments(); //считаем кол-во статей
    const pagesCount: number = Math.ceil(countedDocuments / pageSize);
    const allArticles = await this.articleRepository.getAllArticles(
      sortBy,
      sortDirection,
      pageSize,
      skip,
    ); //забираем из базы
    const paginatedArticles = Paginator.paginate({
      pagesCount: pagesCount,
      pageNumber: pageNumber,
      pageSize: pageSize,
      totalCount: countedDocuments,
      items: allArticles,
    });

    // Кэширование списка всех статей
    await this.cacheManager.set(cacheKey, paginatedArticles);

    return paginatedArticles;
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
    ); //обновляем в бд
    if (!article) {
      throw new NotFoundException({
        message: 'article with current Id wasnt found',
      });
    }
    // Инвалидация кэша после обновления статьи
    await this.cacheManager.del('all_articles');
    await this.cacheManager.del(`article_${articleId}`);
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
      }); //удаляем из бд
    }
    // Инвалидация кэша после удаления статьи
    await this.cacheManager.del('all_articles');
    await this.cacheManager.del(`article_${articleId}`);
    return isDeleted;
  }
}
