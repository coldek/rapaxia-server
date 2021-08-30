import { Column, Entity, OneToMany } from "typeorm";
import { AbstractEntity } from "../abstract-entity";
import { Role } from "../user/user.entity";
import { ForumThread } from "./forum-thread.entity";

@Entity()
export class ForumTopic extends AbstractEntity {
    @Column()
    title: string

    @Column({unique: true})
    slug: string

    @Column()
    description: string

    @Column({type: 'enum', enum: Role, default: Role.Guest})
    role: Role

    @OneToMany(type => ForumThread, thread => thread.topic)
    threads: ForumThread[]
}