import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MatchesModule } from './matches/matches.module';
import { LoggsModule } from './loggs/loggs.module';
import { GlobalRankingModule } from './global-ranking/global-ranking.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    MatchesModule,
    LoggsModule,
    GlobalRankingModule,
  ],
})
export class AppModule {}
