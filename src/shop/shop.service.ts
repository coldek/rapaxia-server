import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item, ItemType } from 'src/db/item.entity';
import { User } from 'src/db/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ShopService {
    constructor(
        @InjectRepository(Item)
        private itemRepository: Repository<Item>
    ) {}

    public async getAll(): Promise<Item[]> {
        let items = await this.itemRepository.find()

        return items
    }

    public async create(user: User): Promise<Item> {
        // HAND FILE UPLOADING AND SHIT!!!
        let item = new Item()

        item.title = 'Default Face'
        item.description = 'This is the default face'
        item.identifier = 'smile'
        item.price = 0
        item.author = user
        item.type = ItemType.Face

        return await item.save()
    }
}
