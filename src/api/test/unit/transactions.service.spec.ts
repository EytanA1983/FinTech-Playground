import { Test } from '@nestjs/testing';
import { TransactionsService } from '../../src/transactions/transactions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from '../../src/transactions/transaction.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';

describe('TransactionsService', () => {
  let service: TransactionsService;
  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
  };
  const mockHttp = {
    post: jest.fn().mockImplementation((url: string) => {
      if (url.includes('tink.com')) {
        return of({ data: { id: 'txn_123' } });
      }
      return of({ data: { risk_score: 0.83 } });
    }),
  };
  const mockConfig = {
    get: jest.fn((key: string, defaultValue?: string) => {
      if (key === 'DEMO_MODE') return 'false';
      if (key === 'BANK_API_URL') return 'https://api.tink.com/transactions';
      if (key === 'ML_API_URL') return 'http://localhost:8000/analyze';
      return defaultValue;
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: getRepositoryToken(Transaction), useValue: mockRepo },
        { provide: HttpService, useValue: mockHttp },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = moduleRef.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create transaction and return riskScore', async () => {
    const dto = { accountId: 'acc1', amount: 100, currency: 'USD' };
    const created = { ...dto, bankId: 'txn_123', riskScore: 0.83 };
    mockRepo.create.mockReturnValue(created);
    mockRepo.save.mockResolvedValue(created);

    const res = await service.create(dto);
    expect(mockRepo.create).toHaveBeenCalled();
    expect(mockRepo.save).toHaveBeenCalled();
    expect(res.riskScore).toBe(0.83); // per dummy ML
  });
});
