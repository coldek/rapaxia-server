import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { AbstractEntity } from "../abstract-entity";
import { InventoryItem } from "./inventory-item.entity";
import { User } from "../user/user.entity";

export enum ItemType {
    Face = 'face',
    Shirt = 'shirt',
    Pants = 'pants',
    Hat = 'hat',
    Accessory = 'accessory'
}

@Entity()
export class Item extends AbstractEntity {
    @Column()
    title: string

    @Column()
    description: string

    @Column()
    identifier: string

    @OneToOne(type => User) @JoinColumn()
    author: User

    @Column()
    price: number

    @OneToMany(type => InventoryItem, inventoryItem => inventoryItem.item)
    owners: InventoryItem[]

    @Column({type: 'enum', enum: ItemType})
    type: ItemType
}