import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';

type BankTransactionResponse = {
  id?: string;
};

type MlAnalyzeResponse = {
  risk_score?: number;
};

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly repo: Repository<Transaction>,
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  async create(dto: CreateTransactionDto) {
    const demoMode = this.config.get<string>('DEMO_MODE', 'true') === 'true';
    const bankUrl = this.config.get<string>(
      'BANK_API_URL',
      'https://api.tink.com/transactions',
    );
    const mlUrl = this.config.get<string>(
      'ML_API_URL',
      'http://localhost:8000/analyze',
    );

    // 1. שיגרה ל‑Open‑Banking API (ל‑demo נשתמש ב‑mock)
    const bankResp: { data: BankTransactionResponse } = demoMode
      ? { data: { id: `mock-${Date.now()}` } }
      : await lastValueFrom(
          this.http.post<BankTransactionResponse>(bankUrl, dto),
        );
    // 2. נשלח ל‑ML Service לקבלת “risk‑score”
    const mlResp: { data: MlAnalyzeResponse } = demoMode
      ? { data: { risk_score: 0.83 } }
      : await lastValueFrom(
          this.http.post<MlAnalyzeResponse>(mlUrl, { data: bankResp.data }),
        );
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
}
