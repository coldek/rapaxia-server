import { Body, Controller, Get, Param, Post, Req, Response } from '@nestjs/common';
import { ForumService } from './forum.service';
import { Response as ResponseType } from 'express'
import { CreateForumThreadDto } from './dto/forum-thread.dto';
import { IsStrict } from 'src/middleware/is-strict.middleware';
import { Throttle } from '@nestjs/throttler';
import { CreateForumReplyDto } from './dto/forum-reply.dto';

@Controller('forum')
export class ForumController {
    constructor(
        private readonly forumService: ForumService
    ) {}

    @Get('/topics')
    async fetchTopic() {
        let topics = await this.forumService.fetchTopics()

        return topics
    }

    @Get('/topics/:topicId')
    async fetchThreads(
        @Param('topicId') topicId: number,
        @Response() res: ResponseType
    ) {
        let {take, skip} = res.locals.paginate
        let topic = await this.forumService.fetchTopic(topicId)

        res.send(
            {
                topic,
                threads: await this.forumService.fetchThreads(topicId, take, skip) 
            }
        )
    }

    @Throttle(3, 120000) // 1 post every two minutes
    @Post('/topics/:topicId')
    @IsStrict()
    async createThread(
        @Req() {user},
        @Param('topicId') topicId: number,
        @Body() payload: CreateForumThreadDto
    ) {
        let thread = await this.forumService.createThread(user, topicId, payload)

        return thread
    }

    @Get('/threads/:threadId')
    async getThread(
        @Response() res: ResponseType,
        @Param('threadId') threadId: number
    ) {
        let {take, skip} = res.locals.paginate
        let thread = await this.forumService.getThread(threadId)
        let replies = await this.forumService.getReplies(thread, take, skip)
        
        res.send ({
            thread,
            replies
        })
    }

    // @Throttle(1, 120000)
    @Post('/threads/:threadId')
    @IsStrict()
    async createReply(
        @Req() {user},
        @Param('threadId') threadId: number,
        @Body() payload: CreateForumReplyDto
    ) {
        let thread = await this.forumService.getThread(threadId)

        return await this.forumService.createReply(thread, payload, user)
    }
}
