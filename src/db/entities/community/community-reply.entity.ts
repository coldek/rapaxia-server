import { AfterLoad, Column, Entity, JoinTable, ManyToOne } from "typeorm";
import { AbstractEntity } from "../abstract-entity";
import { CommunityMember } from "./community-member.entity";
import { CommunityThread } from "./community-thread.entity";

@Entity()
export class CommunityReply extends AbstractEntity {
    @Column()
    body: string

    @ManyToOne(type => CommunityMember, member => member.replies)
    author: CommunityMember

    @ManyToOne(type => CommunityThread, thread => thread.replies)
    thread: CommunityThread

    @Column({default: false})
    scrubbed: Boolean

    @ManyToOne(type => CommunityReply)
    quoting: CommunityReply

    @AfterLoad()
    checkScrubbed() {
        if(this.scrubbed)
        {
            this.body = '[Censored]'
        }
    }
}