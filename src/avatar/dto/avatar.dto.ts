import { Type } from "class-transformer";
import { IsDefined, IsEmpty, IsHexColor, IsOptional, IsString, Matches, ValidateNested } from "class-validator";

export class AvatarColorDTO {
    @IsString()
    @IsOptional()
    @Matches(/^[0-9A-F]{6}$/i, {message: 'Invalid hex color for head.'})
    head: string

    @IsString()
    @Matches(/^[0-9A-F]{6}$/i, {message: 'Invalid hex color for torso.'})
    @IsOptional()
    torso: string

    @IsString()
    @Matches(/^[0-9A-F]{6}$/i, {message: 'Invalid hex color for left arm.'})
    @IsOptional()
    left_arm: string

    @IsString()
    @Matches(/^[0-9A-F]{6}$/i, {message: 'Invalid hex color for right arm.'})
    @IsOptional()
    right_arm: string

    @IsString()
    @Matches(/^[0-9A-F]{6}$/i, {message: 'Invalid hex color for left leg.'})
    @IsOptional()
    left_leg: string

    @IsString()
    @Matches(/^[0-9A-F]{6}$/i, {message: 'Invalid hex color for right leg.'})
    @IsOptional()
    right_leg: string
}

export class AvatarDTO {
    @ValidateNested({each: true, message:'Invalid'})
    @Type(() => AvatarColorDTO)
    colors: AvatarColorDTO[]
}