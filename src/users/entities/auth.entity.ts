//src/auth/entity/auth.entity.ts
import { ApiProperty } from '@nestjs/swagger';

export class AuthEntity {
    @ApiProperty()
    access_token: string;

    @ApiProperty()
    refresh_token: string;
}
