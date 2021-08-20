import { BeforeInsert, Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm'
import { AbstractEntity } from './abstract-entity';
import bcrypt = require('bcrypt')
import crypto = require('crypto')
import { Comment } from './comment.entity';
import { Avatar } from './avatar.entity';
import { InventoryItem } from './inventory-item.entity';
import { Item } from './item.entity';

const select = (columns: string[]) => {
    return columns ? { select: columns as any }: {}
}

@Entity()
export class User extends AbstractEntity {
    @Column({unique: true})
    username: string

    @Column({unique: true, nullable: true})
    email: string

    @Column({select: false})
    password: string

    @Column({unique: true, nullable: true, select: false})
    token: string

    @Column({default: 0, select: false})
    currency: number

    @OneToOne(type => Avatar, avatar => avatar.user) @JoinColumn()
    avatar: Avatar

    @OneToMany(type => Comment, comment => comment.author)
    comments: Comment[]

    @Column({default: false})
    beta: boolean

    @OneToMany(type => InventoryItem, inventoryItem => inventoryItem.user)
    inventory: InventoryItem[]

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
}