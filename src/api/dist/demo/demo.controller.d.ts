import { DemoService } from './demo.service';
export declare class DemoController {
    private readonly demoService;
    constructor(demoService: DemoService);
    overview(): Promise<{
        app: string;
        demoMode: string;
        timestamp: string;
        services: {
            db: {
                status: string;
                message?: undefined;
            } | {
                status: string;
                message: string;
            };
            redis: {
                status: string;
                ping: "PONG";
                message?: undefined;
            } | {
                status: string;
                message: string;
                ping?: undefined;
            };
            ml: {
                status: string;
                riskScore: number | null;
                message?: undefined;
                url?: undefined;
            } | {
                status: string;
                message: string;
                url: string;
                riskScore?: undefined;
            };
        };
    }>;
}
