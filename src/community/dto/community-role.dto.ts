import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayNotEmpty, ArrayUnique, IsAlphanumeric, IsArray, IsEnum, IsJSON, IsNumber, IsOptional, IsString, IsUUID, Length, Matches, Max, Min, ValidateNested } from "class-validator";
import { Profanity } from "src/db/dto/profanity.decorator";
import { PermType, PermTypes } from "src/db/entities/community/community-role.entity";
import { Match } from "src/users/dto/match.decorator";

export class CommunityRoleDTO {
    @IsString()
    @Matches(/^[a-z0-9 ]+$/i)
    @Profanity()
    @Length(3, 12)
    name: string

    @IsArray()
    @IsEnum(PermTypes, {each: true, message: 'Invalid perm type.'})
    perms: PermType[]
}

export class PatchCommunityRoleDTO {
    @IsString()
    @Matches(/^[a-z0-9 ]+$/i) // Allows spaces
    @Profanity()
    @Length(3, 12)
    @IsOptional()
    name?: string
    
    @IsArray()
    @IsEnum(PermTypes, {each: true, message: 'Invalid perm type.'})
    @IsOptional()
    perms?: PermType[]

    @IsArray()
    @IsOptional()
    @ArrayNotEmpty()
    @ArrayMaxSize(10)
    @ArrayUnique()
    @IsUUID('all', {each: true})
    order?: string[]
}