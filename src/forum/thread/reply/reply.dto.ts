import { IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class ReplyDTO {
    @IsString()
    @MinLength(5)
    @MaxLength(4000)
    body: string
}