import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { Profanity } from "src/db/dto/profanity.decorator";

export class CreateForumReplyDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(5000)
    @Profanity()
    body: string
}