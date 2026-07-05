import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Contradiction } from './contradiction.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env['DATABASE_URL'],
      entities: [Contradiction],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Contradiction]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
