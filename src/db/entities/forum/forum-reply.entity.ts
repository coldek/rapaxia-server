import { AfterInsert, AfterLoad, BeforeInsert, Column, Entity, ManyToOne, OneToOne } from "typeorm";
import { AbstractEntity } from "../abstract-entity";
import { User } from "../user/user.entity";
import { ForumThread } from "./forum-thread.entity";

@Entity()
export class ForumReply extends AbstractEntity {
    @Column()
    body: string

    @ManyToOne(type => ForumThread)
    thread: ForumThread

    @ManyToOne(type => ForumReply)
    quoting: ForumReply

    @ManyToOne(type => User, {eager: true})
    author: User

    @Column({default: false})
    scrubbed: boolean

    @AfterLoad()
    checkScrubbed() {
        if(this.scrubbed) {
            this.body = '[Censored]'
        }
    }
}