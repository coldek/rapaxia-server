import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Profanity } from "src/db/dto/profanity.decorator";

export class ThreadDTO {
    @IsString()
    @MinLength(4)
    @MaxLength(40)
    @Profanity({message: 'Innapropiate language for title'})
    title: string

    @MinLength(5)
    @MaxLength(5000)
    @IsString()
    @Profanity()
    body: string

    @IsOptional()
    @IsBoolean()
    locked: boolean

    @IsOptional()
    @IsBoolean()
    pinned: boolean
}

export class UpdateThreadDTO {
    @IsString()
    @MinLength(4)
    @MaxLength(25)
    @IsOptional()
    @Profanity()
    title: string

    @MinLength(5)
    @MaxLength(5000)
    @IsString()
    @IsOptional()
    @Profanity()
    body: string
    
    @IsOptional()
    @IsBoolean()
    locked: boolean

    @IsOptional()
    @IsBoolean()
    pinned: boolean
}