import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { AbstractEntity } from "./abstract-entity";
import { User } from "./user.entity";

@Entity()
export class Comment extends AbstractEntity {
    @Column()
    text: string

    @ManyToOne(type => User, author => author.comments)
    author: User
}