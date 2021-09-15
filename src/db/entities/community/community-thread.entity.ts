import { AfterLoad, Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "../abstract-entity";
import { CommunityMember } from "./community-member.entity";
import { CommunityReply } from "./community-reply.entity";
import { Community } from "./community.entity";

@Entity()
export class CommunityThread extends AbstractEntity {
    @Column()
    title: string

    @Column()
    body: string

    @ManyToOne(type => Community, community => community.threads)
    community: Community

    @ManyToOne(type => CommunityMember, member => member.threads)
    author: CommunityMember

    @OneToMany(type => CommunityReply, reply => reply.thread)
    replies: CommunityReply[]

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    bump: Date

    @Column({default: false})
    locked: Boolean

    @Column({default: false})
    pinned: Boolean

    @Column({default: false})
    scrubbed: Boolean

    @AfterLoad()
    checkScrubbed() {
        if(this.scrubbed)
        {
            this.title = '[Censored]'
            this.body = '[Censored]'
        }
    }
}