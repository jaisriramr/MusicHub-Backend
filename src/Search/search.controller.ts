import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('all')
  async GetAll(@Query('query') query: string) {
    try {
      const response = await this.searchService.searchAll(query);
      return response;
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }
}
