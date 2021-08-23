import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
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

    @ManyToOne(type => User)
    author: User

    @OneToMany(type => ForumReply, reply => reply.thread)
    replies: ForumReply[]
}