import { BaseEntity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export abstract class AbstractEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @UpdateDateColumn({select: false})
    updated: Date

    @CreateDateColumn()
    created: Date

}