import { ApiProperty } from '@nestjs/swagger';

export class SolveContradictionDto {
  @ApiProperty({
    description: 'Free-text description of the problem or technical contradiction to solve',
    example: 'Our API needs to be faster but adding a cache makes it harder to keep data consistent',
  })
  problemDescription!: string;
}

export class RateSolutionDto {
  @ApiProperty({ description: 'Rating given to a previously generated solution', example: 5 })
  rating!: number;
}
