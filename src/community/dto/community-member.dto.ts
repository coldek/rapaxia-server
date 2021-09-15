import { IsString, IsUUID } from "class-validator";
import { IsUniqueDB } from "src/db/dto/is-unique.decorator";
import { CommunityRole } from "src/db/entities/community/community-role.entity";

export class CommunityMemberDTO {
    @IsString()
    @IsUUID()
    role: string
}