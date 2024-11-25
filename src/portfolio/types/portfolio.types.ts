export interface GroupedClient {
  clientId: string;
  totalMrr: number;
  churnRates: number[];
  loanStatus?: 'Aprobado' | 'Rechazado' | 'Sin solicitudes';
}
