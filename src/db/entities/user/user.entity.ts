import { AfterLoad, BeforeInsert, Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm'
import { AbstractEntity } from '../abstract-entity';
import bcrypt = require('bcrypt')
import crypto = require('crypto')
import { Comment } from '../shop/comment.entity';
import { Avatar } from './avatar.entity';
import { InventoryItem } from '../shop/inventory-item.entity';
import { Item } from '../shop/item.entity';
import { CommunityMember } from '../community/community-member.entity';
import { Notification } from './notification.entity';

const select = (columns: string[]) => {
    return columns ? { select: columns as any }: {}
}

export enum Role {
    Guest = 0,
    Verified = 1,
    Member = 2,
    Mod = 3,
    Admin = 4,
    Super = 5,
}

@Entity()
export class User extends AbstractEntity {
    @Column({unique: true})
    username: string

    @Column({unique: true, nullable: true, select: false})
    email: string

    @Column({select: false})
    password: string

    @Column({unique: true, nullable: true, select: false})
    token: string

    @Column({default: 0, select: false})
    currency: number

    @OneToOne(type => Avatar, avatar => avatar.user, {
        eager: true
    }) @JoinColumn()
    avatar: Avatar

    @OneToMany(type => Comment, comment => comment.author)
    comments: Comment[]

    @Column({default: false})
    beta: boolean

    @Column({type: 'enum', enum: Role, default: Role.Guest})
    role: Role

    @OneToMany(type => InventoryItem, inventoryItem => inventoryItem.user)
    inventory: InventoryItem[]

    @OneToMany(type => CommunityMember, member => member.user)
    communities: CommunityMember[]

    @Column({type: 'text'})
    bio: string

    @Column({type: 'text'})
    status: string

    @OneToMany(type => Notification, notification => notification.user)
    notifications: Notification[]

    @Column({type: 'bigint', default: 0})
    seenLast: number

    isOnline: boolean

    /**
     * Update token hash
     */
    public async refreshToken() {
        this.token = crypto.randomBytes(20).toString('hex')
    }

    /**
     * Give user more currency
     * @param amount 
     */
    public async giveCoin(amount: number) {
        this.currency += amount

        await this.save()
    }

    async updateSeen() {
        this.seenLast = Date.now()
        await this.save()
    }

    /**
     * Give item
     * @param item - The item
     * @param gift - Is a gift?
     * @returns 
     */
    public async giveItem(item: Item, gift:boolean = false): Promise<InventoryItem> {
        let inventoryItem = new InventoryItem()

        inventoryItem.item = item
        inventoryItem.user = this

        // if it isn't a gift, take away currency
        if(!gift) {
            await this.giveCoin(item.price * -1)
        }

        return await inventoryItem.save()
    }

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10)
    }

    @AfterLoad()
    async checkOnline() {
        this.isOnline = Date.now() - this.seenLast < 60000
    }

    /**
     * If the user's role is bigger than or equal to param role
     * @param role 
     * @returns 
     */
    hasRole(role: Role): boolean {
        return this.role >= role
    }
}