import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePortfolioDto {
  @IsNotEmpty()
  name: string = '';

  @IsNumber()
  mrr: number = 0;

  @IsNumber()
  churnRate: number = 0;
}
