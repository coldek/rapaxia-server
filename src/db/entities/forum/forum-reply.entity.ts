import { Column, Entity, ManyToOne, OneToOne } from "typeorm";
import { AbstractEntity } from "../abstract-entity";
import { ForumThread } from "./forum-thread.entity";

@Entity()
export class ForumReply extends AbstractEntity {
    @Column()
    body: string

    @ManyToOne(type => ForumThread, thread => thread.replies)
    thread: ForumThread

    @OneToOne(type => ForumReply)
    quoting: ForumReply
}