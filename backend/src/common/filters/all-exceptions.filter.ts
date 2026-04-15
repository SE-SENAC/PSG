import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    } else if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST;
      const errorCode = (exception as any).code;

      // Mapeamento de erros comuns do drive de banco (SQL Server / PostgreSQL / etc)
      switch (errorCode) {
        case '23505': // PostgreSQL Unique Violation
        case '2627': // SQL Server Unique Constraint
        case '2601': // SQL Server Unique Index
          message = 'Registro duplicado. Este dado já existe no sistema.';
          break;
        case '23503': // PostgreSQL Foreign Key Violation
        case '547': // SQL Server Foreign Key Violation
          message =
            'Não é possível realizar esta ação pois este registro está sendo usado em outro lugar.';
          break;
        default:
          message = 'Erro ao processar dados no banco de dados.';
      }

      this.logger.warn(`Database Error: ${errorCode} - ${exception.message}`);
    } else {
      this.logger.error(
        `Unexpected Error: ${exception instanceof Error ? exception.message : exception}`,
        exception instanceof Error ? exception.stack : '',
      );
    }

    const errorDetails = typeof message === 'string' ? { message } : message;

    response.status(status).json({
      ...(typeof errorDetails === 'object'
        ? errorDetails
        : { message: errorDetails }),
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
