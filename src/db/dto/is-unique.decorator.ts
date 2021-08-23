import { Injectable } from "@nestjs/common"
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator"
import { Connection, EntityTarget } from "typeorm"

/**
 * Whether or not this field is unique in a table.
 * EXAMPLE: Email verification:
 * @example IsUniqueDB(User, 'email', true, {message: 'Email already exists.'})
 * @param entity The target entity
 * @param column The target column
 * @param invert If true, it will be validated if the column is unique. If false, it will be validated if the column isn't unique.
 * @param validationOptions 
 * @returns 
 */
export function IsUniqueDB(entity: EntityTarget<unknown>, column: string, invert: boolean, validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [entity, column, invert],
            validator: IsUniqueConstraint,
        });
    };
}

@ValidatorConstraint({name: 'IsUniqueDB', async: true})
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
    constructor(
        private connection: Connection
    ) { }

    async validate(value: string, args: ValidationArguments) {
        let [entity, column, invert] = args.constraints
        let find = await this.connection.getRepository(entity).findOne({[column]: value})

        return (invert) ? find === undefined: find !== undefined
    }
}