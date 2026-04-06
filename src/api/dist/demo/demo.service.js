"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("typeorm");
const nestjs_ioredis_1 = require("@nestjs-labs/nestjs-ioredis");
const rxjs_1 = require("rxjs");
let DemoService = class DemoService {
    dataSource;
    redisService;
    http;
    config;
    constructor(dataSource, redisService, http, config) {
        this.dataSource = dataSource;
        this.redisService = redisService;
        this.http = http;
        this.config = config;
    }
    async getOverview() {
        const db = await this.checkDb();
        const redis = await this.checkRedis();
        const ml = await this.checkMl();
        return {
            app: 'ok',
            demoMode: this.config.get('DEMO_MODE', 'true'),
            timestamp: new Date().toISOString(),
            services: {
                db,
                redis,
                ml,
            },
        };
    }
    async checkDb() {
        try {
            await this.dataSource.query('SELECT 1');
            return { status: 'ok' };
        }
        catch (error) {
            return { status: 'error', message: this.errorMessage(error) };
        }
    }
    async checkRedis() {
        try {
            const client = this.redisService.getOrThrow();
            const pong = await client.ping();
            return { status: pong === 'PONG' ? 'ok' : 'error', ping: pong };
        }
        catch (error) {
            return { status: 'error', message: this.errorMessage(error) };
        }
    }
    async checkMl() {
        const mlUrl = this.config.get('ML_API_URL', 'http://localhost:8000/analyze');
        try {
            const resp = await (0, rxjs_1.lastValueFrom)(this.http.post(mlUrl, { data: { accountId: 'probe', amount: 1, currency: 'USD' } }, { timeout: 2000 }));
            return { status: 'ok', riskScore: resp.data?.risk_score ?? null };
        }
        catch (error) {
            return { status: 'error', message: this.errorMessage(error), url: mlUrl };
        }
    }
    errorMessage(error) {
        if (error instanceof Error) {
            return error.message;
        }
        return 'Unknown error';
    }
};
exports.DemoService = DemoService;
exports.DemoService = DemoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        nestjs_ioredis_1.RedisService,
        axios_1.HttpService,
        config_1.ConfigService])
], DemoService);
//# sourceMappingURL=demo.service.js.map