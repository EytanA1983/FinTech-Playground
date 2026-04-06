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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const transaction_entity_1 = require("./transaction.entity");
let TransactionsService = class TransactionsService {
    repo;
    http;
    config;
    constructor(repo, http, config) {
        this.repo = repo;
        this.http = http;
        this.config = config;
    }
    async create(dto) {
        const demoMode = this.config.get('DEMO_MODE', 'true') === 'true';
        const bankUrl = this.config.get('BANK_API_URL', 'https://api.tink.com/transactions');
        const mlUrl = this.config.get('ML_API_URL', 'http://localhost:8000/analyze');
        const bankResp = demoMode
            ? { data: { id: `mock-${Date.now()}` } }
            : await (0, rxjs_1.lastValueFrom)(this.http.post(bankUrl, dto));
        const mlResp = demoMode
            ? { data: { risk_score: 0.83 } }
            : await (0, rxjs_1.lastValueFrom)(this.http.post(mlUrl, { data: bankResp.data }));
        const riskScore = mlResp.data.risk_score ?? 0;
        const transaction = this.repo.create({
            accountId: dto.accountId,
            amount: dto.amount,
            currency: dto.currency,
            bankId: bankResp.data.id ?? undefined,
            riskScore,
        });
        return this.repo.save(transaction);
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        axios_1.HttpService,
        config_1.ConfigService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map