import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');

  const adapter = app.getHttpAdapter();
  adapter.get(
    '/health',
    (_req: unknown, res: { send: (body: unknown) => void }) => {
      res.send({ status: 'ok', service: 'banking-api' });
    },
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
