import { IsNotEmpty, IsAlphanumeric, IsString, MinLength, MaxLength, IsDate, IsNumber, IsEmail, Validate } from 'class-validator'
import { IsUniqueDB } from 'src/db/dto/is-unique.decorator'
import { Profanity } from 'src/db/dto/profanity.decorator'
import { User } from 'src/db/entities/user/user.entity'
import { UserExists, UserExistsRule } from 'src/users/dto/users-exists.decorator'
import { Match } from './match.decorator'
export class LoginDTO {
    @IsNotEmpty()
    @IsAlphanumeric()
    @MinLength(4)
    @MaxLength(20)
    @IsUniqueDB(User, 'username', false, {message: 'Username does not exist.'})
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
    @IsUniqueDB(User, 'username', true, {message: 'Username already exists.'})
    @Profanity()
    username: string

    @IsNotEmpty()
    @IsEmail()
    @IsUniqueDB(User, 'email', true, {message: 'Email already exists.'})
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