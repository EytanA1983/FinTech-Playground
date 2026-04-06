import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { RedisService } from '@nestjs-labs/nestjs-ioredis';
import { lastValueFrom } from 'rxjs';

type MlAnalyzeResponse = {
  risk_score?: number;
};

@Injectable()
export class DemoService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly redisService: RedisService,
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  async getOverview() {
    const db = await this.checkDb();
    const redis = await this.checkRedis();
    const ml = await this.checkMl();

    return {
      app: 'ok',
      demoMode: this.config.get<string>('DEMO_MODE', 'true'),
      timestamp: new Date().toISOString(),
      services: {
        db,
        redis,
        ml,
      },
    };
  }

  private async checkDb() {
    try {
      await this.dataSource.query('SELECT 1');
      return { status: 'ok' };
    } catch (error) {
      return { status: 'error', message: this.errorMessage(error) };
    }
  }

  private async checkRedis() {
    try {
      const client = this.redisService.getOrThrow();
      const pong = await client.ping();
      return { status: pong === 'PONG' ? 'ok' : 'error', ping: pong };
    } catch (error) {
      return { status: 'error', message: this.errorMessage(error) };
    }
  }

  private async checkMl() {
    const mlUrl = this.config.get<string>(
      'ML_API_URL',
      'http://localhost:8000/analyze',
    );
    try {
      const resp = await lastValueFrom(
        this.http.post<MlAnalyzeResponse>(
          mlUrl,
          { data: { accountId: 'probe', amount: 1, currency: 'USD' } },
          { timeout: 2000 },
        ),
      );
      return { status: 'ok', riskScore: resp.data?.risk_score ?? null };
    } catch (error) {
      return { status: 'error', message: this.errorMessage(error), url: mlUrl };
    }
  }

  private errorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return 'Unknown error';
  }
}
