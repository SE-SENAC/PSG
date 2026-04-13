import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogActivity } from './entities/log-activity.entity';

@Injectable()
export class LogActivityMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(LogActivity)
    private readonly logActivityRepository: Repository<LogActivity>,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, url } = req;
    
    // We'll create the log after the request is finished to capture the correct status code
    res.on('finish', () => {
      const user = (req as any).user;
      
      this.logActivityRepository.save({
        ip: ip,
        status: res.statusCode,
        method: method,
        page_route: url,
        userId: user ? user.id : null,
        activity: this.formatActivity(method, url),
      }).catch(err => console.error('Error saving log activity:', err));
    });

    next();
  }

  private formatActivity(method: string, url: string): string {
    const resource = url.split('/')[1] || 'home';
    const actions: { [key: string]: string } = {
      'GET': 'Visualizou',
      'POST': 'Criou/Processou',
      'PUT': 'Atualizou',
      'PATCH': 'Modificou',
      'DELETE': 'Removeu'
    };
    return `${actions[method] || 'Acessou'} ${resource}`;
  }
}
