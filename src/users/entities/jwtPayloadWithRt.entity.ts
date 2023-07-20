import { ApiProperty } from '@nestjs/swagger';

export class JwtPayloadWithRt {
    @ApiProperty()
    id: number;

    @ApiProperty()
    email: string;

    @ApiProperty()
    refreshToken: string;
}
