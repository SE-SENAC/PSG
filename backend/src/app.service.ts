import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * Retorna uma mensagem de boas-vindas da API.
   */
  getHello(): string {
    return 'API do PSG - Senac Sergipe rodando!';
  }
}
