import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { Profanity } from "src/db/dto/profanity.decorator";

export class CreateForumThreadDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(40)
    @Profanity()
    title: string

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(5000)
    @Profanity()
    body: string
}