import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AbstractEntity } from "../abstract-entity";
import { User } from "./user.entity";

@Entity()
export class Friend extends BaseEntity
{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({nullable: true})
    senderId: number

    @ManyToOne(type => User)
    sender: User

    @Column({nullable: true})
    receiverId: number

    @ManyToOne(type => User)
    receiver: User

    @Column({type: 'boolean', default: false})
    accepted: boolean

    public isFriend(uid: number): boolean {
        return this.receiverId == uid || this.senderId == uid
    }
}