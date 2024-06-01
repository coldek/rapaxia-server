import { AfterLoad, BeforeInsert, Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "../abstract-entity";
import { User } from "../user/user.entity";
import { ForumTopic } from "./forum-topic.entity";
import { ForumReply } from "./forum-reply.entity";

@Entity()
export class ForumThread extends AbstractEntity {
    @ManyToOne(() => User, user => user.threads)
    author: User

    @Column()
    title: string

    @Column()
    body: string

    @ManyToOne(() => ForumTopic, topic => topic.threads)
    topic: ForumTopic

    @OneToMany(() => ForumReply, reply => reply.thread)
    replies: ForumReply[]

    @Column({type: 'timestamptz', default: () => "CURRENT_TIMESTAMP"})
    bumped: Date

    @ManyToOne(() => User)
    bumped_by: User

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

    @BeforeInsert()
    updateBumped() {
        this.bumped_by = this.author
    }
}