import { AfterLoad, BeforeInsert, Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "../abstract-entity";
import { User } from "../user/user.entity";
import { ForumReply } from "./forum-reply.entity";
import { ForumTopic } from "./forum-topic.entity";

@Entity()
export class ForumThread extends AbstractEntity {
    @Column()
    title: string

    @Column()
    body: string

    @ManyToOne(type => ForumTopic, forumTopic => forumTopic.threads)
    topic: ForumTopic

    @ManyToOne(type => User, {eager: true})
    author: User

    @OneToMany(type => ForumReply, reply => reply.thread)
    replies: ForumReply[]

    @Column({default: false})
    scrubbed: true

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    bump: Date

    @Column({default: 0})
    views: number

    @Column({default: false})
    locked: boolean

    @Column({default: false})
    pinned: boolean

    @AfterLoad()
    checkScrubbed() {
        if(this.scrubbed) {
            this.title = '[Censored]'
            this.body = '[Censored]'
        }
    }
}