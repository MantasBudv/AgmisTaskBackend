import { Injectable, NotFoundException, Redirect } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Url } from './url.model';
import { UsersService } from '../users/users.service';
import shortid = require('shortid');

@Injectable()
export class UrlsService {
  constructor(
    @InjectModel('Url') private readonly urlModel: Model<Url>,
    private readonly usersService: UsersService,
  ) {}

  async createUrl(full_url: string) {
    let result: Url;
    try {
      const email = this.usersService.getLoggedInUser().email;
      const tinyUrl: string = shortid.generate();
      const newUrl = new this.urlModel({
        tiny_url: tinyUrl,
        full_url,
        created_by: email,
      });
      result = await newUrl.save();
    } catch (error) {
      throw new NotFoundException('User is not logged in.');
    }
    return result.id as string;
  }

  async getUrlsByUser(): Promise<Url[]> {
    let urls: Url[];
    try {
      const email = this.usersService.getLoggedInUser().email;
      urls = await this.urlModel.find({ created_by: email }).exec();
    } catch (error) {
      throw new NotFoundException('User is not logged in.');
    }
    if (urls.length === 0) {
      throw new NotFoundException('Could not find url.');
    }
    return urls;
  }

  async redirectToFullUrl(tinyUrl: string) {
    const fullUrl = await this.getFullUrl(tinyUrl);
    Redirect(fullUrl);
  }

  private async getFullUrl(tinyUrl: string): Promise<string> {
    let urls: Url[];
    try {
      urls = await this.urlModel.find({ tiny_url: tinyUrl }).exec();
    } catch {
      throw new NotFoundException('Could not find tiny url.');
    }
    if (urls.length === 0) {
      throw new NotFoundException('Could not find tiny url.');
    }
    return urls[0].full_url;
  }
}
