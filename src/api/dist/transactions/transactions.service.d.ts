import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
export declare class TransactionsService {
    private readonly repo;
    private readonly http;
    private readonly config;
    constructor(repo: Repository<Transaction>, http: HttpService, config: ConfigService);
    create(dto: CreateTransactionDto): Promise<Transaction>;
}
