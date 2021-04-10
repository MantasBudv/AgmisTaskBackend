import { Controller, Post, Body, Get, Param } from '@nestjs/common';

import { UrlsService } from './urls.service';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
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
  async redirectToFullUrl(@Param('tinyUrl') tinyUrl: string) {
    const urls = await this.urlsService.redirectToFullUrl(tinyUrl);
    return urls;
  }
}
