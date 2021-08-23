import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { SanitizerConstraint, CustomSanitizer } from 'class-sanitizer'
import Filter = require('bad-words')
const filter = new Filter({placeHolder: '#'})

/**
 * Check if the given property contains profane language.
 * @param validationOptions 
 * @returns 
 */
export function Profanity(validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: ProfanityConstraint,
        });
    };
}
@ValidatorConstraint({name: 'Profanity'})
export class ProfanityConstraint implements ValidatorConstraintInterface {
    constructor() { }

    async validate(value: string, args: ValidationArguments) {
        // Censor is true
        return !filter.isProfane(value)
    }

    defaultMessage() {
        return 'Innapropiate language'
    }
}

// @SanitizerConstraint()
// export class ProfanitySanitize implements CustomSanitizer {
//     sanitize(value: string): string {
//         console.log(value)
//         return filter.clean(value)
//     }
// }