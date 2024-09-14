import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { ArticlesRepository } from '../repository/articles.repository';
import { Article } from '../domain/articles.entity';
import { NotFoundException } from '@nestjs/common';

describe('ArticlesService', () => {
  let articlesService: ArticlesService;
  let articlesRepository: Partial<jest.Mocked<ArticlesRepository>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: ArticlesRepository,
          useValue: {
            save: jest.fn(),
            getAllArticles: jest.fn(),
            countAllDocuments: jest.fn(),
            updateArticle: jest.fn(),
            deleteArticle: jest.fn(),
          },
        },
      ],
    }).compile();

    articlesService = module.get<ArticlesService>(ArticlesService);
    articlesRepository = module.get(ArticlesRepository);
  });

  describe('addArticle', () => {
    it('should create and return a new article', async () => {
      const createArticleDto = {
        title: 'Test Title',
        description: 'Test Description',
      };
      const userId = 1;
      const expectedArticle = new Article();
      expectedArticle.authorId = userId;
      expectedArticle.title = createArticleDto.title;
      expectedArticle.description = createArticleDto.description;
      expectedArticle.publicationDate = expect.any(Date);

      (articlesRepository.save as jest.Mock).mockResolvedValue({
        ...expectedArticle,
        id: expect.any(Number),
      });

      const result = await articlesService.addArticle(createArticleDto, userId);

      expect(articlesRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(expectedArticle),
      );
      expect(result).toMatchObject(expectedArticle);
    });
  });

  describe('getArticles', () => {
    it('should return paginated articles', async () => {
      const sortingParams = {
        sortBy: 'publicationDate',
        sortDirection: 'desc',
        pageNumber: 1,
        pageSize: 10,
      };
      const articles = [new Article()];
      (articlesRepository.getAllArticles as jest.Mock).mockResolvedValue(
        articles,
      );
      (articlesRepository.countAllDocuments as jest.Mock).mockResolvedValue(1);

      const result = await articlesService.getArticles(sortingParams);

      expect(articlesRepository.getAllArticles).toHaveBeenCalledWith(
        'publicationDate',
        'desc',
        10,
        0,
      );
      expect(result.items).toEqual(articles);
      expect(result.pagesCount).toBe(1);
    });
  });

  describe('updateArticle', () => {
    it('should update and return the updated article', async () => {
      const userId = 1;
      const articleId = 1;
      const updateArticleDto = {
        title: 'Updated Title',
        description: 'Updated Description',
      };
      const existingArticle = new Article();
      existingArticle.id = articleId;
      existingArticle.authorId = userId;

      (articlesRepository.updateArticle as jest.Mock).mockResolvedValue({
        ...existingArticle,
        ...updateArticleDto,
      });

      const result = await articlesService.updateArticle(
        userId,
        articleId,
        updateArticleDto,
      );

      expect(articlesRepository.updateArticle).toHaveBeenCalledWith(
        userId,
        articleId,
        updateArticleDto,
      );
      expect(result.title).toBe(updateArticleDto.title);
    });

    it('should throw NotFoundException if article not found', async () => {
      const userId = 1;
      const articleId = 999;
      const updateArticleDto = {
        title: 'Updated Title',
        description: 'Updated Description',
      };

      (articlesRepository.updateArticle as jest.Mock).mockResolvedValue(null);

      await expect(
        articlesService.updateArticle(userId, articleId, updateArticleDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteArticle', () => {
    it('should delete the article and return true', async () => {
      const userId = 1;
      const articleId = 1;

      (articlesRepository.deleteArticle as jest.Mock).mockResolvedValue(true);

      const result = await articlesService.deleteArticle(userId, articleId);

      expect(articlesRepository.deleteArticle).toHaveBeenCalledWith(
        userId,
        articleId,
      );
      expect(result).toBe(true);
    });

    it('should throw NotFoundException if article not found', async () => {
      const userId = 1;
      const articleId = 999;

      (articlesRepository.deleteArticle as jest.Mock).mockResolvedValue(false);

      await expect(
        articlesService.deleteArticle(userId, articleId),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
