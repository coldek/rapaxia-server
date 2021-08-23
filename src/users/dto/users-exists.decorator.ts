import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { User } from "src/db/entities/user/user.entity";
import { Repository } from "typeorm";
import { UsersService } from "../users.service";

export function UserExists(property: string, validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: UserExistsRule,
        });
    };
}

@ValidatorConstraint({name: 'UserExists', async: true})
@Injectable()
export class UserExistsRule implements ValidatorConstraintInterface {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>
        
    ) { }

    async validate(username: string, args: ValidationArguments) {
        
        let user = await this.usersRepository.findOne({username})

        return (args.constraints[0] === 'login') ? user !== undefined: user === undefined
    }

    defaultMessage(args: ValidationArguments) {
        return (args.constraints[0] === 'login') ? 'User was not found.': 'User already exists.'
    }
}
