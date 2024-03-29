import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from 'src/users/entities';

export const GetCurrentUserId = createParamDecorator(
    (_: undefined, context: ExecutionContext): number => {
        const request = context.switchToHttp().getRequest();
        const user = request.user as JwtPayload;
        //console.log(user);
        return user.id;
    },
);
