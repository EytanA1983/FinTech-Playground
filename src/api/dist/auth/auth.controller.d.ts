import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    health(): {
        status: string;
    };
    login(userId: string): string;
    demoToken(): {
        access_token: string;
    };
}
