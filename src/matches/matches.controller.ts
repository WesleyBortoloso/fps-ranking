import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { MatchRankingService } from "./match-ranking/match-ranking.service";
import { MatchesService } from "./matches.service";
import { BearerTokenGuard } from "../auth/bearer-token.guard";
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Matches')
@ApiBearerAuth('bearer')
@UseGuards(BearerTokenGuard)
@Controller('api/v1/matches')
export class MatchesController {
  constructor(
    private readonly rankingService: MatchRankingService,
    private readonly matchesService: MatchesService,
  ) {}

  @ApiOperation({ summary: 'Ranking por partida' })
  @Get(':matchId/ranking')
  async getRanking(@Param('matchId') matchId: number) {
    return this.rankingService.getRanking(Number(matchId));
  }

  @ApiOperation({ summary: 'Listagem de partidas' })
  @Get()
  async list() {
    return this.matchesService.listMatches();
  }

  @ApiOperation({ summary: 'Detalhes da partida' })
  @Get(':matchId')
  async details(@Param('matchId') matchId: number) {
    return this.matchesService.getMatchDetails(Number(matchId));
  }
}


