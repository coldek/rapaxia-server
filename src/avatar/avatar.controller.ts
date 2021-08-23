import { Body, Controller, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { spawnSync } from 'child_process'
import { User } from 'src/db/entities/user/user.entity';
import { Repository } from 'typeorm';
import { AvatarService } from './avatar.service';
import { AvatarDTO } from './dto/avatar.dto';

@Controller('avatar')
export class AvatarController {
    constructor(
        private readonly avatarService: AvatarService
    ) {}

    @UseGuards(AuthGuard('jwt'))
    @Post('/render')
    async render(@Request() req) {
        return await this.avatarService.render(req.user.id)
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('/')
    async updateCharacter(@Body() body: AvatarDTO, @Request() req) {
        return await this.avatarService.updateAvatar(req.user, body)
    }
}
