import { Controller, Post, Body, Get, Param } from '@nestjs/common';

import { UrlsService } from './urls.service';

@Controller('url')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('create')
  async addUrl(@Body('full_url') full_url: string) {
    const generatedId = await this.urlsService.createUrl(full_url);
    return { id: generatedId };
  }

  @Get('all')
  async getAllUrls() {
    const urls = await this.urlsService.getUrlsByUser();
    return urls;
  }

  @Get(':tinyUrl')
  redirectToFullUrl(@Param('tinyUrl') tinyUrl: string) {
    const fullUrl = this.urlsService.redirectToFullUrl(tinyUrl);
    return fullUrl;
  }
}
