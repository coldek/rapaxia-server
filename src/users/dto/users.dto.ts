import { IsNotEmpty, IsAlphanumeric, IsString, MinLength, MaxLength, IsDate, IsNumber, IsEmail, Validate } from 'class-validator'
import { UserExists, UserExistsRule } from 'src/users/dto/users-exists.decorator'
import { Match } from './match.decorator'
export class LoginDTO {
    @IsNotEmpty()
    @IsAlphanumeric()
    @MinLength(4)
    @MaxLength(20)
    @UserExists('login')
    username: string

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    password: string
}

export class RegisterDTO {
    @IsNotEmpty()
    @IsAlphanumeric()
    @MinLength(4)
    @MaxLength(20)
    @UserExists('register')
    username: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    password: string

    @IsNotEmpty()
    @IsString()
    @Match('password')
    confirm_password: string
}