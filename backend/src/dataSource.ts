import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: 'localhost',
  port: 1433,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/**/*.migration{.ts,.js}'],
  subscribers: [__dirname + '/**/*.subscriber{.ts,.js}'],
  synchronize: true,
});

AppDataSource.initialize()
  .then(() => {
    // Log de sucesso na inicialização do banco de dados
    console.log('Fonte de dados inicializada com sucesso!');
  })
  .catch((err) => {
    // Log de erro no caso de falha na conexão ou inicialização
    console.error('Erro durante a inicialização da fonte de dados:', err);
  });
