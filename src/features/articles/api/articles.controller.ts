import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { Article } from '../domain/articles.entity';
import { ArticlesService } from '../application/articles.service';
import { CurrentUserId } from '../../../infrastructure/decorators/current-user-id.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt.auth.guard';
import { SortingQueryParams } from './dto/sorting/sorting-query.dto';
import { AllArticlesOutputModel } from './dto/output/articles.output.model';
import { UpdateArticleDto } from './dto/udate-article.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addArticle(
    @Body() createArticleDto: CreateArticleDto,
    @CurrentUserId() userId: number,
  ): Promise<Article> {
    return await this.articlesService.addArticle(createArticleDto, userId); //добавляем статью
  }
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateArticle(
    @Param('id', ParseIntPipe) articleId: number,
    @Body() updateArticleDto: UpdateArticleDto,
    @CurrentUserId() userId: number,
  ) {
    return await this.articlesService.updateArticle(
      userId,
      articleId,
      updateArticleDto,
    ); //обновляем статью
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getArticles(
    @Query() sortingParams: SortingQueryParams,
  ): Promise<AllArticlesOutputModel | null> {
    return await this.articlesService.getArticles(sortingParams); //получаем список статей с пагинацией
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArticle(
    @Param('id', ParseIntPipe) articleId: number,
    @CurrentUserId() userId: number,
  ): Promise<boolean> {
    return await this.articlesService.deleteArticle(userId, articleId); //удаляем статью
  }
}
