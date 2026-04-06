import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CourseSeed } from '../seed';
import { EditalSeed } from '../seed';
import { ResultSeed } from '../seed';
import { CategorySeed } from '../seed';
import { AdminSeed } from '../seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      "http://localhost:3000",
      "http://192.168.1.116:3000",
      "http://192.168.1.33:3000"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  });

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('PSG API')
    .setDescription('API de bolsas de estudo')
    .setVersion('1.0')
    .addTag('cursos')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  try {
    const categorySeeder = app.get(CategorySeed);
    const seeder = app.get(CourseSeed);
    const editalSeeder = app.get(EditalSeed);
    const resultSeeder = app.get(ResultSeed);
    const adminSeeder = app.get(AdminSeed);
    await categorySeeder.run();
    await seeder.run();
    await editalSeeder.run();
    await resultSeeder.run();
    await adminSeeder.run();
  } catch (e) {
    throw e;
  }

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
