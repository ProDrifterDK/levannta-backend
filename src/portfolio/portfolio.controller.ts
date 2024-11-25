import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
  Get,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as ExcelJS from 'exceljs';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadPortfolio(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file.buffer);

    const worksheet = workbook.worksheets[0];
    const portfolio: CreatePortfolioDto[] = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const name = row.getCell(1).value?.toString() || '';
      const mrr = parseFloat(row.getCell(2).value?.toString() || '0');
      const churnRate = parseFloat(row.getCell(5).value?.toString() || '0');

      portfolio.push({ name, mrr, churnRate });
    });

    const results = this.portfolioService.calculateMaxAdvance(portfolio);
    return results;
  }

  @Post('/apply-loan')
  async applyLoan(
    @Body() loanRequest: { clientId: string; amount: number },
  ): Promise<{
    approved: boolean;
    message: string;
    paymentTable?: { month: number; amount: number }[];
  }> {
    const { clientId, amount } = loanRequest;

    if (!clientId || !amount) {
      throw new BadRequestException('Client ID and amount are required.');
    }

    return this.portfolioService.applyLoan(clientId, amount);
  }

  @Get()
  getClients() {
    return this.portfolioService.getClients();
  }

  @Get('/loan-status')
  getLoanStatus(@Query('clientId') clientId: string) {
    if (!clientId) {
      throw new BadRequestException('Client ID is required.');
    }
    return this.portfolioService.getLoanStatus(clientId);
  }
}
