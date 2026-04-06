import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    create(dto: CreateTransactionDto): Promise<import("./transaction.entity").Transaction>;
    demo(): Promise<import("./transaction.entity").Transaction>;
}
