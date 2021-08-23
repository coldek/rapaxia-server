import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { Avatar } from 'src/db/entities/user/avatar.entity';
import { User } from 'src/db/entities/user/user.entity';
import { Repository } from 'typeorm';
import { AvatarDTO } from './dto/avatar.dto';

@Injectable()
export class AvatarService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(Avatar)
        private readonly avatarRepository: Repository<Avatar>
    ) { }
    
    /**
     * Render an avatar
     * @param userId ID of user
     * @returns 
     */
    async render(userId: number): Promise<Avatar> {
        let user = await this.usersRepository.findOne(userId, {relations: ['avatar']})
        let {avatar} = user

        return await (await avatar.render()).save()
    }

    async getAvatarFromId(userId: number): Promise<Avatar> {
        let avatar = await (await this.usersRepository.findOne(userId)).avatar

        return await this.avatarRepository.findOne(avatar, {select: ['colors']})
    }

    /**
     * 
     * @param avatar the user avatar
     * @param payload 
     */
    async updateAvatar(user: any, payload: AvatarDTO): Promise<Avatar> {
        // let user = await this.usersRepository.findOne(userPayload.id, {relations: ['avatar']})
        // let avatar = user.avatar
        let avatar = user.avatar

        let {colors} = await this.avatarRepository.createQueryBuilder('avatar')
            .select('avatar.colors')
            .where(avatar.id)
            .getOne()
        avatar.colors = {...colors, ...payload.colors}

        return await avatar.save()
    }
}
