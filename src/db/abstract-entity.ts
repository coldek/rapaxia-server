import { BaseEntity, Column, CreateDateColumn, PrimaryGeneratedColumn, Repository, UpdateDateColumn } from 'typeorm'

export function getCols<T>(repository: Repository<T>): (keyof T)[] {
    return (repository.metadata.columns.map(col => col.propertyName) as (keyof T)[]);
}

export abstract class AbstractEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @UpdateDateColumn({select: false})
    updated: Date

    @CreateDateColumn()
    created: Date
}