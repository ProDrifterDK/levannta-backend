import { Injectable } from '@nestjs/common';
import { GroupedClient } from './types/portfolio.types';

@Injectable()
export class PortfolioService {
  private clients: Record<string, GroupedClient> = {};

  calculateScore(mrr: number, churnRate: number): number {
    return mrr / 1000 - churnRate * 10;
  }

  calculateMaxAdvance(
    portfolio: { name: string; mrr: number; churnRate: number }[],
  ): { clientId: string; maxAdvance: number }[] {
    const groupedPortfolio = portfolio.reduce<Record<string, GroupedClient>>(
      (acc, client) => {
        if (!acc[client.name]) {
          acc[client.name] = {
            clientId: client.name,
            totalMrr: 0,
            churnRates: [],
          };
        }

        acc[client.name].totalMrr += client.mrr;
        acc[client.name].churnRates.push(client.churnRate);

        return acc;
      },
      {},
    );

    const results = Object.values(groupedPortfolio).map((group) => {
      const averageChurnRate =
        group.churnRates.reduce((sum, rate) => sum + rate, 0) /
        group.churnRates.length;

      const score = this.calculateScore(group.totalMrr, averageChurnRate);
      const maxAdvance = score > 70 ? group.totalMrr * 3 : 0;

      console.log(
        `Cliente: ${group.clientId}, Total MRR: ${group.totalMrr}, Churn Rate Promedio: ${averageChurnRate}, Score: ${score}, Adelanto Máximo: ${maxAdvance}`,
      );

      this.clients[group.clientId] = group;

      return { clientId: group.clientId, maxAdvance };
    });

    return results;
  }

  applyLoan(
    clientId: string,
    amount: number,
  ): {
    approved: boolean;
    message: string;
    paymentTable?: { month: number; amount: number }[];
  } {
    const client = this.clients[clientId];
    if (!client) {
      return { approved: false, message: 'Cliente no encontrado.' };
    }

    const averageChurnRate =
      client.churnRates.reduce((sum, rate) => sum + rate, 0) /
      client.churnRates.length;

    const score = this.calculateScore(client.totalMrr, averageChurnRate);
    const maxAdvance = score > 70 ? client.totalMrr * 3 : 0;

    if (amount > maxAdvance) {
      client.loanStatus = 'Rechazado';
      return {
        approved: false,
        message: 'La cantidad solicitada excede el máximo.',
      };
    }

    const paymentTable = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      amount: amount / 12,
    }));

    client.loanStatus = 'Aprobado';

    return {
      approved: true,
      message: 'Adelanto aprobado exitosamente.',
      paymentTable,
    };
  }

  getClients(): { clientId: string; maxAdvance: number }[] {
    return Object.values(this.clients).map((client) => {
      const averageChurnRate =
        client.churnRates.reduce((sum, rate) => sum + rate, 0) /
        client.churnRates.length;

      const score = this.calculateScore(client.totalMrr, averageChurnRate);
      const maxAdvance = score > 70 ? client.totalMrr * 3 : 0;

      return {
        clientId: client.clientId,
        maxAdvance,
      };
    });
  }

  getLoanStatus(clientId: string): { clientId: string; status: string } {
    const client = this.clients[clientId];
    if (!client) {
      throw new Error(`No se encontró un cliente con ID: ${clientId}`);
    }

    return { clientId, status: client.loanStatus || 'Sin solicitudes' };
  }
}
