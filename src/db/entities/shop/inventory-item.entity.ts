import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "../abstract-entity"
import { Item } from "./item.entity";
import { User } from "../user/user.entity";

@Entity()
export class InventoryItem extends AbstractEntity {
    @Column({default: false})
    equipped: boolean
    
    @ManyToOne(type => User, user => user.inventory)
    user: User

    @ManyToOne(type => Item, item => item.owners)
    item: Item
}