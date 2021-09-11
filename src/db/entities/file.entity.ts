import { AfterInsert, AfterLoad, Column, Entity, OneToOne } from "typeorm";
import { AbstractEntity } from "./abstract-entity";
import { User } from "./user/user.entity";

@Entity()
export class File extends AbstractEntity {
    @Column({unique: true})
    src: String

    @Column({default: false})
    verified: Boolean

    @OneToOne(type => User)
    user: User

    @AfterLoad()
    private async censor() {
        if(!this.verified) {
            this.src = 'Pending'
        }
    }

    async verify(): Promise<File> {
        this.verified = !this.verified
        return this.save()
    }
}