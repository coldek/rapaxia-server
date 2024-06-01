import { AfterLoad, Column, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "../abstract-entity";
import { User } from "../user/user.entity";
import { ForumThread } from "./forum-thread.entity";

@Entity()
export class ForumReply extends AbstractEntity {
    @ManyToOne(type => User, user => user.replies)
    author: User

    @ManyToOne(type => ForumThread, thread => thread.replies)
    thread: ForumThread

    @Column()
    body: string

    @Column({default: false})
    scrubbed: Boolean

    @ManyToOne(type => ForumReply)
    quoting: ForumReply

    @AfterLoad()
    checkScrubbed() {
        if(this.scrubbed)
        {
            this.body = '[Censored]'
        }
    }
}