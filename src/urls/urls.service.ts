import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Url } from './url.model';

@Injectable()
export class UrlsService {
  constructor(@InjectModel('Url') private readonly urlModel: Model<Url>) {}

  async createUrl(tiny_url: string, full_url: string, created_by: string) {
    const newUrl = new this.urlModel({
      tiny_url,
      full_url,
      created_by,
    });
    const result = await newUrl.save();
    return result.id as string;
  }

  async getUrlsByUser(userId: string): Promise<Url[]> {
    let urls: Url[];
    try {
      urls = await this.urlModel.find((url) => url.created_by === userId);
    } catch (error) {
      throw new NotFoundException('Could not find url.');
    }
    if (urls.length === 0) {
      throw new NotFoundException('Could not find url.');
    }
    return urls;
  }
}
