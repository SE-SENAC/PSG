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

      this.logActivityRepository
        .save({
          ip: ip,
          status: res.statusCode,
          method: method,
          page_route: url,
          userId: user ? user.id : null,
          activity: this.formatActivity(method, url),
        })
        .catch((err) => console.error('Error saving log activity:', err));
    });

    next();
  }

  private formatActivity(method: string, url: string): string {
    const path = url.split('?')[0];
    const segments = path.split('/').filter(Boolean);
    const actions: { [key: string]: string } = {
      GET: 'Visualizou',
      POST: 'Criou/Processou',
      PUT: 'Atualizou',
      PATCH: 'Modificou',
      DELETE: 'Removeu',
    };

    const verb = actions[method] || 'Acessou';
    if (segments.length === 0) {
      return `${verb} a página inicial`;
    }

    const resource = segments[0];
    const description = this.describeRoute(resource, segments.slice(1));
    return `${verb} ${description}`;
  }

  private describeRoute(resource: string, segments: string[]): string {
    const resourceName = this.humanizeResource(resource);

    if (resource === 'auth') {
      const actionSegment = segments[0];
      if (
        ['login', 'login-admin', 'login-super-admin'].includes(actionSegment)
      ) {
        return 'a autenticação do usuário';
      }
      if (actionSegment === 'logout') {
        return 'a saída do usuário';
      }
      if (['register', 'register-admin'].includes(actionSegment)) {
        return 'o registro de usuário';
      }
      if (['me', 'profile'].includes(actionSegment)) {
        return 'o perfil do usuário';
      }
      return `a rota de autenticação ${segments.join('/')}`;
    }

    if (resource === 'course') {
      const first = segments[0];
      if (!first) return 'o catálogo de cursos';
      if (first === 'filter') return 'a filtragem de cursos';
      if (first === 'search') return 'a busca de cursos';
      if (this.isId(first)) return `os detalhes do curso ${first}`;
    }

    if (resource === 'subscription' && segments[0] === 'confirm') {
      return 'a confirmação de inscrição';
    }

    if (segments.length > 0 && this.isId(segments[0])) {
      return `${resourceName} ${segments[0]}`;
    }

    if (segments.length === 0) {
      return resourceName;
    }

    return `o recurso de ${resourceName} (${segments.join('/')})`;
  }

  private humanizeResource(resource: string): string {
    const labels: { [key: string]: string } = {
      address: 'endereço',
      admin: 'administrador',
      auth: 'autenticação',
      category: 'categoria',
      course: 'curso',
      configuration: 'configuração',
      diretrizes: 'diretrizes',
      edital: 'edital',
      phone: 'telefone',
      student: 'aluno',
      subscription: 'inscrição',
      'super-admin': 'super-administrador',
      'type-user': 'tipo de usuário',
      user: 'usuário',
      'sig-api-consumer': 'consumidor SIG',
      results: 'resultados',
    };

    return labels[resource] || resource.replace(/-/g, ' ');
  }

  private isId(segment: string): boolean {
    return /^[0-9a-fA-F]{8,}$/.test(segment) || /^\d+$/.test(segment);
  }
}
