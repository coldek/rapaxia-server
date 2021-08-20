import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { spawnSync } from 'child_process'
import { User } from 'src/db/user.entity';
import { Repository } from 'typeorm';

@Controller('avatar')
export class AvatarController {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    @UseGuards(AuthGuard('jwt'))
    @Post('/render')
    async render(@Request() req) {
        let user = await this.userRepository.findOne(req.user.id, {relations: ['avatar']})
        let avatar = user.avatar

        return await avatar.render()
    }
}
