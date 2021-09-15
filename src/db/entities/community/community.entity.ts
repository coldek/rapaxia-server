import { AfterInsert, BaseEntity, BeforeInsert, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { AbstractEntity } from "../abstract-entity";
import { File } from "../file.entity";
import { User } from "../user/user.entity";
import { CommunityMember } from "./community-member.entity";
import { CommunityRole } from "./community-role.entity";
import { CommunityThread } from "./community-thread.entity";

@Entity()
export class Community extends BaseEntity {
    @PrimaryColumn({unique: true})
    slug: string

    @Column()
    title: string

    @Column()
    description: string

    @OneToOne(type => File, {eager: true, nullable: true})
    @JoinColumn()
    image: File

    @Column()
    private: Boolean

    @Column({nullable: true})
    defaultRoleId: string

    @OneToOne(type => CommunityRole, role => role.community, {eager: true})
    @JoinColumn()
    defaultRole: CommunityRole

    @OneToMany(type => CommunityRole, role => role.community)
    roles?: CommunityRole[]

    @Column('simple-array')
    roleOrder: string[]

    @ManyToOne(type => User, {eager: true})
    creator: User

    @ManyToMany(type => User)
    @JoinTable()
    bans: User[]

    @OneToMany(type => CommunityMember, member => member.community)
    members: CommunityMember[]

    @OneToMany(type => CommunityThread, thread => thread.community)
    threads: CommunityThread[]

    @BeforeInsert()
    toLowerCase() {
        this.slug = this.slug.toLowerCase()
    }
}