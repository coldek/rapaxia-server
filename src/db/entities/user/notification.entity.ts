import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../abstract-entity";
import { File } from "../file.entity";
import { User } from "./user.entity";

@Entity()
export class Notification extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @CreateDateColumn()
    created: Date

    @ManyToOne(type => User, user => user.notifications)
    user: User

    @Column()
    text: string

    @Column()
    link: string

    @ManyToOne(type => File)
    image: File

    @ManyToOne(type => User)
    otherUser: User
}