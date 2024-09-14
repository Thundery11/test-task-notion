import { Module } from '@nestjs/common';
import { ArticlesController } from '../api/articles.controller';
import { ArticlesService } from '../application/articles.service';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
