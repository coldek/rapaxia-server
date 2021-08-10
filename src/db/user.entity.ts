import { BeforeInsert, Column, Entity } from 'typeorm'
import { AbstractEntity } from './abstract-entity';
import bcrypt = require('bcrypt')

@Entity()
export class User extends AbstractEntity {
    @Column({unique: true})
    username: string

    @Column({select: false})
    password: string

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10)
    }
}