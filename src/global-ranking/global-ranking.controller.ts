import { Controller, Get, UseGuards } from '@nestjs/common';
import { GlobalRankingService } from './global-ranking.service';
import { BearerTokenGuard } from '../auth/bearer-token.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('GlobalRanking')
@ApiBearerAuth('bearer')
@UseGuards(BearerTokenGuard)
@Controller('api/v1/rankings')
export class GlobalRankingController {
  constructor(private readonly service: GlobalRankingService) {}

  @ApiOperation({ summary: 'Ranking global' })
  @Get('global')
  async getGlobalRanking() {
    return this.service.getGlobalRanking();
  }
}
