import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';

import { UrlsService } from './urls.service';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  async addUrl(
    @Body('tiny_url') tiny_url: string,
    @Body('full_url') full_url: string,
    @Body('created_by') created_by: string,
  ) {
    const generatedId = await this.urlsService.createUrl(
      tiny_url,
      full_url,
      created_by,
    );
    return { id: generatedId };
  }

  @Get()
  async getAllUrls() {
    const urls = await this.urlsService.getUrlsByUser('test@gmail.com');
    return urls;
  }
}
