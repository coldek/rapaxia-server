import { IsAlphanumeric, IsBoolean, IsOptional, IsString, Length, length, MaxLength, MinLength } from 'class-validator'
import { IsUniqueDB } from 'src/db/dto/is-unique.decorator'
import { Community } from 'src/db/entities/community/community.entity'

export class PostCommunityDTO {
    @IsUniqueDB(Community, 'slug', true, {message: 'Community already exists'})
    @IsString()
    @IsAlphanumeric()
    @Length(3, 20)
    slug: string
    
    @IsString()
    @Length(4, 35)
    title: string

    @IsString()
    @Length(4, 2000)
    description: string
    
    @IsBoolean()
    @IsOptional()
    private: Boolean
}

export class PatchCommunityDTO {
    @IsString()
    @IsOptional()
    @Length(4, 35)
    title?: string

    @IsString()
    @IsOptional()
    @Length(4, 2000)
    description?: string

    @IsBoolean()
    @IsOptional()
    private?: boolean

    // TODO: Add change for default role
}