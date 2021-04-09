import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UrlsModule } from './urls/urls.module';

@Module({
  imports: [
    UsersModule,
    UrlsModule,
    MongooseModule.forRoot(
      'mongodb+srv://dbUser:dbUserPassword@cluster0.2lc2u.mongodb.net/AgmisTask?retryWrites=true&w=majority',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
