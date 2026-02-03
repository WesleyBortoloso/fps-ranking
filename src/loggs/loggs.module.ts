import { Module } from '@nestjs/common';
import { LogsController } from './loggs.controller';
import { LoggsService } from './loggs.service';
import { LogParser } from '../log-parser/log-parser';
import { MatchProcessorService } from '../matches/match-processor/match-processor.service';
import { MatchPersistenceModule } from '../matches/match-persistence/match-persistence.module';

@Module({
  controllers: [LogsController],
  providers: [
    LoggsService,
    LogParser,
    MatchProcessorService
  ],
  imports: [
    MatchPersistenceModule,
  ],
})
export class LoggsModule {}
