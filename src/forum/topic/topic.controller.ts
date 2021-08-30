import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, PayloadTooLargeException, Post, Query, Req, Request, Res, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { request } from 'express';
import { RolesGuard } from 'src/account/strategies/roles.guard';
import { Role } from 'src/db/entities/user/user.entity';
import { TopicDTO } from './topic.dto';
import { TopicService } from './topic.service';
import { Response } from 'express';
import { ThreadService } from '../thread/thread.service';
import { ThreadDTO } from '../thread/thread.dto';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('forum/topic')
export class TopicController {
    constructor(
        private readonly topicService: TopicService,
        private readonly threadService: ThreadService
    ) {}

    /**
     * GET topics
     * @returns 
     */
    @Get()
    @SkipThrottle()
    async index() {
        return await this.topicService.getAll()
    }

    /**
     * GET topic
     * @param id 
     * @returns 
     */
    @Get('/:slug')
    @SkipThrottle()
    async get(@Param('slug') slug: string) {
        return await this.topicService.get(slug)
    }

    /**
     * 
     * @param id 
     * @param query 
     * @returns 
     */
    @Get('/:slug/threads')
    @SkipThrottle()
    async getThreads(@Param('slug') slug: string, @Query() query) {
        let {take = 10, skip = 0} = query
        if(take > 15) throw new PayloadTooLargeException('Too many rows requested')
        let topic = await this.topicService.get(slug)
        return await this.threadService.fetchThreads(topic, take, skip)
    }

    /**
     * PATCH topic
     * @param id 
     * @param body 
     * @returns 
     */
    @Patch('/:slug')
    @SetMetadata('role', Role.Super)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async patch(@Param('slug') slug: string, @Body() body) {
        return await this.topicService.update(slug, body)
    }

    /**
     * POST topic
     * @param body 
     * @returns 
     */
    @Post()
    @SetMetadata('role', Role.Super)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async post(@Body() body: TopicDTO) {
        return await this.topicService.insert(body)
    }

    /**
     * POST forum thread
     * @param id 
     * @param req 
     * @param payload 
     * @returns 
     */
    @Post('/:slug/create')
    @UseGuards(AuthGuard('jwt'))
    async createThread(@Param('slug') slug: string, @Req() req, @Body() payload: ThreadDTO) {
        let user = req.user
        let topic = await this.topicService.get(slug)

        return await this.threadService.create(user, topic, payload)
    }

    /**
     * DELETE topic
     * @param id 
     * @param res 
     */
    @Delete('/:id')
    @SetMetadata('role', Role.Super)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async delete(@Param('id') id: number, @Res() res: Response) {
        await this.topicService.delete(id)
        res.status(HttpStatus.OK).json({
            status: 200,
            message: 'Topic was deleted'
        })
    }
}
