import { IsNotEmpty, IsAlphanumeric, IsString, MinLength, MaxLength, IsDate, IsNumber } from 'class-validator'
import { Match } from './match.decorator'
export class LoginDTO {
    @IsNotEmpty()
    @IsAlphanumeric()
    @MinLength(4)
    @MaxLength(20)
    username: string

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    password: string
}

export class RegisterDTO extends LoginDTO {
    @IsNotEmpty()
    @IsString()
    @Match('password')
    confirm_password: string
}