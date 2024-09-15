import { Module } from '@nestjs/common';
import { ArticlesController } from '../api/articles.controller';
import { ArticlesService } from '../application/articles.service';
import { ArticlesRepository } from '../repository/articles.repository';
import { Article } from '../domain/articles.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Article])],
  controllers: [ArticlesController],
  providers: [ArticlesService, ArticlesRepository],
})
export class ArticlesModule {}
