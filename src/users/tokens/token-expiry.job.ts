import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable, Logger } from '@nestjs/common';
import { TokenExpiryService } from './token-expiry.service';

@Injectable()
export class TokenExpiryJob {
    private readonly logger = new Logger(TokenExpiryJob.name);

    constructor(private readonly tokenExpiryService: TokenExpiryService) {}

    @Cron(CronExpression.EVERY_12_HOURS)
    async handleCron() {
        try {
            this.logger.debug('Running token expiry job');
            await this.tokenExpiryService.deleteExpiredTokens();
            this.logger.debug('Token expiry job completed');
            console.log('Task done');
        } catch (error) {
            this.logger.error(
                `Error running token expiry job: ${error.message}`,
            );
        }
    }
}
