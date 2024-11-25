import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioEntity } from './portfolio/portfolio.entity';
import { PortfolioModule } from './portfolio/portfolio.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [PortfolioEntity],
      synchronize: true,
    }),
    PortfolioModule,
  ],
})
export class AppModule {}
