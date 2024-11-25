import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioEntity } from './portfolio.entity';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PortfolioEntity])],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}
