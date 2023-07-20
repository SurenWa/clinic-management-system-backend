import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@ValidatorConstraint({ async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
    async validate(value: any): Promise<boolean> {
        const user = await prisma.role.findFirst({
            where: { role_name: value },
        });
        return !user; // Return true if the user doesn't exist
    }
}

export function IsUnique(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string): void {
        registerDecorator({
            name: 'isUnique',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUniqueConstraint,
        });
    };
}
