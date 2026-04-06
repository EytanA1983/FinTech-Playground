import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private jwtService;
    constructor(jwtService: JwtService);
    login(userId: string): string;
    validateUser(userId: string): {
        userId: string;
    };
}
