import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TokenExpiryService {
    constructor(private readonly prisma: PrismaService) {}

    async deleteExpiredTokens(): Promise<void> {
        const expiredTokens = await this.prisma.token.findMany({
            where: {
                createdAt: {
                    lte: new Date(Date.now() - 24 * 3600000), // Delete tokens older than 1 day (adjust the duration as needed)
                },
            },
        });

        for (const token of expiredTokens) {
            await this.prisma.token.delete({ where: { id: token.id } });
        }
    }
}
