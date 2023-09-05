//src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from '../entities';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    // async validate(payload: { userId: number }) {
    //     const user = await this.usersService.findOne(payload.userId);
    //     console.log(user);

    //     if (!user) {
    //         throw new UnauthorizedException();
    //     }

    //     // if (user.role !== 'ADMIN') {
    //     //     throw new UnauthorizedException('Unauthorized');
    //     // }

    //     // if (user.role.role_name !== 'ADMIN') {
    //     //     throw new UnauthorizedException('Unauthorized');
    //     // }

    //     return user;
    // }

    validate(payload: JwtPayload) {
        console.log(payload);
        return payload;
    }
}
