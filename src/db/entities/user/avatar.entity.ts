import { AbstractEntity } from "../abstract-entity";
import { AfterInsert, AfterUpdate, BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToOne } from "typeorm";
import crypto = require('crypto');
import { User } from "./user.entity";
import { exec, execSync } from 'child_process'
import { unlink, unlinkSync } from 'fs'
import { Config } from "src/config";
import { Item } from "../shop/item.entity";
import internal = require("stream");

const path = require("path")

// Used for colors
export interface Colors {
    head: string
    torso: string
    left_arm: string
    right_arm: string
    left_leg: string
    right_leg: string
}

export interface Apparel {
    hats: [Item, Item, Item]
    accessories: [Item, Item]
    shirt: Item,
    tshirt: Item,
    pants: Item
}

// Default Apparel
const defaultApparel: Apparel = {
    hats: [null, null, null],
    accessories: [null, null],
    shirt: null,
    tshirt: null,
    pants: null
}
// Default Colors
const defaultColors: Colors = {
    head: 'adaca6',
    torso: '93cfc9',
    left_arm: 'adaca6',
    right_arm: 'adaca6',
    left_leg: 'adaca6',
    right_leg: 'adaca6'
}

@Entity()
export class Avatar extends AbstractEntity {
    @Column({type: 'json', default: JSON.stringify(defaultColors), select: false})
    colors: Colors

    @Column({type: 'json', default: JSON.stringify(defaultApparel), select: false})
    apparel: Apparel

    @Column()
    cache: string

    @OneToOne(type => User, user => user.avatar)
    user: User

    @BeforeUpdate()
    @BeforeInsert()
    public async render() {
        // Delete previous files of render
        try {
            await unlinkSync(path.resolve(Config.directories.root, Config.directories.body+this.cache+'.png'))
            await unlinkSync(path.resolve(Config.directories.root, Config.directories.headshots+this.cache+'.png'))
        } catch (err) { }
        
        // Generate new cache
        this.cache = crypto.randomBytes(20).toString('hex')

        // Directory of renderer from config file
        let dir = path.resolve(Config.directories.root + Config.directories.render)

        // If this.colors is not initialized just do the default colors.
        let {head, left_arm, left_leg, right_arm, right_leg, torso} = (this.colors === undefined) ? defaultColors: this.colors

        let data = JSON.stringify({
            export: `${this.cache}.png`,
            colors: {
                face: head,
                left_leg, right_leg, right_arm, left_arm, torso
            },
            images: {
                face: null,
                shirt: null,
                pants: null
            }
        }).replace(/\"/g, '\\"')
        
        await execSync(`blender -b --python ${dir} -- ${data}`)

        return this
    }
}