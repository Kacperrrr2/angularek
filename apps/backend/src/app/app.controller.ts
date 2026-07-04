import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiOkResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { RateSolutionDto, SolveContradictionDto } from './dto';

@ApiTags('contradictions')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // ==========================================
  // Conversational Solving & Contradictions
  // ==========================================
  @Post('solve')
  @ApiOperation({
    summary: 'Solve a contradiction',
    description: 'Runs the problem description through the TRIZ and SCAMPER agents, three times each',
  })
  @ApiCreatedResponse({ description: 'The stored contradiction plus 3 TRIZ and 3 SCAMPER responses' })
  solveContradiction(@Body() dto: SolveContradictionDto) {
    return this.appService.solveContradiction(dto);
  }

  @Get('history')
  @ApiOperation({ summary: 'List all previously solved contradictions' })
  @ApiOkResponse({ description: 'All stored contradictions, most recent first' })
  getHistory() {
    return this.appService.getHistory();
  }

  @Post('solutions/:id/rate')
  @ApiOperation({ summary: 'Rate a previously solved contradiction' })
  @ApiParam({ name: 'id', description: 'Contradiction id' })
  @ApiOkResponse({ description: 'The updated contradiction' })
  rateSolution(@Param('id') id: string, @Body() dto: RateSolutionDto) {
    return this.appService.rateSolution(id, dto.rating);
  }
}
