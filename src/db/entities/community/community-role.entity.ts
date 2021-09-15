import { AfterInsert, BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CommunityMember } from "./community-member.entity";
import { Community } from "./community.entity";

export const PermTypes = [
    'communityEdit', 'communityAnnounce', 'threadsPost', 'threadsDelete', 'threadsPin', 'threadsLock', 'threadsAlwaysPost', 'membersKick', 'membersBan', 'membersApprove', 'membersRole'] as const
export type PermType = typeof PermTypes[number]

@Entity()
export class CommunityRole extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column({nullable: true})
    communitySlug: string

    @ManyToOne(type => Community)
    community: Community

    @Column({type: 'simple-array', default: 'threadsPost'})
    perms: PermType[]

    @OneToMany(type => CommunityMember, member => member.role)
    members: CommunityMember[]
}