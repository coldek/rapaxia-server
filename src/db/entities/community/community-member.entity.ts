import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { CommunityReply } from "./community-reply.entity";
import { CommunityRole } from "./community-role.entity";
import { CommunityThread } from "./community-thread.entity";
import { Community } from "./community.entity";

@Entity()
export class CommunityMember extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @CreateDateColumn()
    joined: Date

    @Column({nullable: true})
    approved: boolean

    @ManyToOne(type => Community, community => community.members)
    community: Community

    @Column({nullable: true})
    roleId: string

    @ManyToOne(type => CommunityRole, role => role.members)
    role: CommunityRole

    @ManyToOne(type => User, user => user.communities)
    user: User

    @OneToMany(type => CommunityThread, thread => thread.author)
    threads: CommunityThread[]

    @OneToMany(type => CommunityReply, reply => reply.author)
    replies: CommunityReply[]
}