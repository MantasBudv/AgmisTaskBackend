import { Controller, Post, Body, Get, Param } from '@nestjs/common';

import { UrlsService } from './urls.service';

@Controller('url')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('create')
  async addUrl(@Body('full_url') full_url: string) {
    const url = await this.urlsService.createUrl(full_url);
    return url;
  }

  @Get('all')
  async getAllUrls() {
    const urls = await this.urlsService.getUrlsByUser();
    return { urls };
  }

  @Get(':tinyUrl')
  async getFullUrl(@Param('tinyUrl') tinyUrl: string) {
    const data = await this.urlsService.getFullUrl(tinyUrl);
    return { fullUrl: data.fullUrl };
  }
}
