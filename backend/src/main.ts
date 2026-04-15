import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { CourseSeed } from '../seed';
import { EditalSeed } from '../seed';
import { ResultSeed } from '../seed';
import { CategorySeed } from '../seed';
import { AdminSeed, SuperAdminSeed } from '../seed';
import compression from 'compression';
import * as bodyParser from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Filtro global de exceções
  app.useGlobalFilters(new AllExceptionsFilter());

  // Habilita compressão Gzip/Brotli para todas as respostas
  app.use(compression());

  // Aumenta o limite do parser para requisições JSON grandes (PDFs codificados em Base64)
  const bodyParserLimit = process.env.BODY_PARSER_LIMIT || '20mb';
  app.use(bodyParser.json({ limit: bodyParserLimit }));
  app.use(bodyParser.urlencoded({ limit: bodyParserLimit, extended: true }));

  // Serve arquivos estáticos (uploads de imagens)
  app.useStaticAssets(path.join(__dirname, '..', 'public'), {
    prefix: '/uploads',
  });

  // Pipe de validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',')
      : true, // Se não especificado, permite todos em desenvolvimento
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  // Habilita confiança no proxy para funcionar corretamente com Nginx
  const server = app.getHttpAdapter().getInstance();
  if (typeof server.set === 'function') {
    server.set('trust proxy', 1);
  }

  app.setGlobalPrefix('api');

  // Configuração do Swagger para documentação da API
  const config = new DocumentBuilder()
    .setTitle('PSG API')
    .setDescription('API do Programa Senac de Gratuidade')
    .setVersion('1.0')
    .addTag('cursos')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  try {
    // Execução dos seeders para popular o banco de dados inicial
    const categorySeeder = app.get(CategorySeed);
    const seeder = app.get(CourseSeed);
    const editalSeeder = app.get(EditalSeed);
    const resultSeeder = app.get(ResultSeed);
    const adminSeeder = app.get(AdminSeed);
    const superAdminSeeder = app.get(SuperAdminSeed);
    await categorySeeder.run();
    await seeder.run();
    await editalSeeder.run();
    await resultSeeder.run();
    await adminSeeder.run();
    await superAdminSeeder.run();
  } catch (e) {
    console.error('Erro ao executar seeds:', e);
  }

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
