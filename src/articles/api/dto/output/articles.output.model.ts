import { Article } from '../../../domain/articles.entity';

export class AllArticlesOutputModel {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Article[];
}
