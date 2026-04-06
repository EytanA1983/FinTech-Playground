import { Strategy as JwtStrategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
type JwtPayload = {
    sub: string;
};
declare const JwtAuthStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => JwtStrategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtAuthStrategy extends JwtAuthStrategy_base {
    private readonly config;
    private readonly authService;
    constructor(config: ConfigService, authService: AuthService);
    validate(payload: JwtPayload): {
        userId: string;
    };
}
export {};
