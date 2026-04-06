"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const nestjs_ioredis_1 = require("@nestjs-labs/nestjs-ioredis");
const axios_1 = require("@nestjs/axios");
const auth_module_1 = require("./auth/auth.module");
const transactions_module_1 = require("./transactions/transactions.module");
const demo_controller_1 = require("./demo/demo.controller");
const demo_service_1 = require("./demo/demo.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (config) => ({
                    ...(config.get('DEMO_MODE', 'true') === 'true'
                        ? {
                            type: 'sqlite',
                            database: 'demo.sqlite',
                        }
                        : {
                            type: 'postgres',
                            host: config.get('DB_HOST', 'localhost'),
                            port: Number(config.get('DB_PORT', 5432)),
                            username: config.get('DB_USER', 'postgres'),
                            password: config.get('DB_PASS', 'postgres'),
                            database: config.get('DB_NAME', 'bankingx'),
                        }),
                    autoLoadEntities: true,
                    synchronize: true,
                }),
                inject: [config_1.ConfigService],
            }),
            nestjs_ioredis_1.RedisModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (config) => ({
                    config: {
                        host: config.get('REDIS_HOST', 'localhost'),
                        port: Number(config.get('REDIS_PORT', 6379)),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            axios_1.HttpModule,
            auth_module_1.AuthModule,
            transactions_module_1.TransactionsModule,
        ],
        controllers: [demo_controller_1.DemoController],
        providers: [demo_service_1.DemoService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map