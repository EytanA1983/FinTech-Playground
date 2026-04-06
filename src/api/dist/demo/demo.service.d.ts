import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { RedisService } from '@nestjs-labs/nestjs-ioredis';
export declare class DemoService {
    private readonly dataSource;
    private readonly redisService;
    private readonly http;
    private readonly config;
    constructor(dataSource: DataSource, redisService: RedisService, http: HttpService, config: ConfigService);
    getOverview(): Promise<{
        app: string;
        demoMode: string;
        timestamp: string;
        services: {
            db: {
                status: string;
                message?: undefined;
            } | {
                status: string;
                message: string;
            };
            redis: {
                status: string;
                ping: "PONG";
                message?: undefined;
            } | {
                status: string;
                message: string;
                ping?: undefined;
            };
            ml: {
                status: string;
                riskScore: number | null;
                message?: undefined;
                url?: undefined;
            } | {
                status: string;
                message: string;
                url: string;
                riskScore?: undefined;
            };
        };
    }>;
    private checkDb;
    private checkRedis;
    private checkMl;
    private errorMessage;
}
