import * as mongoose from 'mongoose';

export const UrlSchema = new mongoose.Schema({
  tiny_url: { type: String, required: true },
  full_url: { type: String, required: true },
  created_by: { type: String, required: true },
});

export interface Url extends mongoose.Document {
  id: string;
  tiny_url: string;
  full_url: string;
  created_by: string;
}
