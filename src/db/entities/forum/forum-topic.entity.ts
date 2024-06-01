import { Column, Entity, OneToMany } from "typeorm";
import { AbstractEntity } from "../abstract-entity";
import { ForumThread } from "./forum-thread.entity";

@Entity()
export class ForumTopic extends AbstractEntity {
    @Column()
    title: string

    @Column()
    description: string

    @OneToMany(() => ForumThread, thread => thread.topic)
    threads: ForumThread[]
}