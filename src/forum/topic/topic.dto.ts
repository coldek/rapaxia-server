import { IsEnum, IsOptional, IsString } from "class-validator";
import { IsUniqueDB } from "src/db/dto/is-unique.decorator";
import { ForumTopic } from "src/db/entities/forum/forum-topic.entity";
import { Role } from "src/db/entities/user/user.entity";

export class TopicDTO {
    @IsString()
    title: string

    @IsString()
    @IsUniqueDB(ForumTopic, 'slug', true, {message: 'Topic already exists.'})
    slug: string

    @IsString()
    description: string

    @IsOptional()
    @IsEnum(Role)
    role: Role
}