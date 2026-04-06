import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@nestjs-labs/nestjs-ioredis';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { TransactionsModule } from './transactions/transactions.module';
import { DemoController } from './demo/demo.controller';
import { DemoService } from './demo/demo.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        ...(config.get<string>('DEMO_MODE', 'true') === 'true'
          ? {
              type: 'sqlite' as const,
              database: 'demo.sqlite',
            }
          : {
              type: 'postgres' as const,
              host: config.get<string>('DB_HOST', 'localhost'),
              port: Number(config.get('DB_PORT', 5432)),
              username: config.get<string>('DB_USER', 'postgres'),
              password: config.get<string>('DB_PASS', 'postgres'),
              database: config.get<string>('DB_NAME', 'bankingx'),
            }),
        autoLoadEntities: true,
        synchronize: true, // ל‑dev בלבד
      }),
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        config: {
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: Number(config.get('REDIS_PORT', 6379)),
        },
      }),
      inject: [ConfigService],
    }),
    HttpModule,
    AuthModule,
    TransactionsModule,
  ],
  controllers: [DemoController],
  providers: [DemoService],
})
export class AppModule {}
