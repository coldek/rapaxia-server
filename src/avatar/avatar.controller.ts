import { Body, Controller, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { spawnSync } from 'child_process'
import { User } from 'src/db/entities/user/user.entity';
import { IsStrict } from 'src/middleware/is-strict.middleware';
import { Repository } from 'typeorm';
import { AvatarService } from './avatar.service';
import { AvatarDTO } from './dto/avatar.dto';

@Controller('avatar')
export class AvatarController {
    constructor(
        private readonly avatarService: AvatarService
    ) {}

    @Post('/render')
    @IsStrict()
    async render(@Request() req) {
        return await this.avatarService.render(req.user.id)
    }

    @Patch('/')
    @IsStrict()
    async updateCharacter(@Body() body: AvatarDTO, @Request() req) {
        return await this.avatarService.updateAvatar(req.user, body)
    }
}
