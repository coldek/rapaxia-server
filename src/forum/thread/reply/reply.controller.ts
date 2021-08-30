import { Body, Controller, Delete, Get, Param, PayloadTooLargeException, Post, Query, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/account/strategies/roles.guard';
import { Role } from 'src/db/entities/user/user.entity';
import { ThreadService } from '../thread.service';
import { ReplyDTO } from './reply.dto';
import { ReplyService } from './reply.service';

@Controller('forum/thread')
export class ReplyController {
    constructor(
        private readonly threadService: ThreadService,
        private readonly replyService: ReplyService
    ) {}

    /**
     * Get replies
     * @example /forum/thread/1/reply?take=1&skip=0
     * @param id 
     * @param query 
     * @returns 
     */
    @Get(':id/reply')
    async replies(@Param('id') id: number, @Query() query) {
        let {take = 10, skip = 0} = query
        if(take > 15) throw new PayloadTooLargeException('Too many rows requested')
        let thread = await this.threadService.fetch(id)

        let replies = await this.replyService.repliesFromThreads(thread, take, skip)

        return replies
    }

    /**
     * POST reply
     * @example /forum/thread/1/reply
     * @example /forum/thread/1/reply/1
     * @param id 
     * @param replyId 
     * @param req 
     * @param body 
     * @returns 
     */
    @Post(':id/reply/:reply?')
    @UseGuards(AuthGuard('jwt'))
    async create(@Param('id') id: number, @Param('reply') replyId: number, @Req() req, @Body() body: ReplyDTO) {
        let thread = await this.threadService.fetch(id)
        let quoting = (replyId === undefined) ? undefined: await this.replyService.getReply(replyId, thread)

        let reply = await this.replyService.createReply(thread, body, req.user, quoting)

        return reply
    }

    /**
     * DELETE reply
     * @example /forum/thread/1/reply/1
     * @param id 
     * @param replyId 
     * @returns A scrubbed reply
     */
    @Delete(':id/reply/:replyId')
    @SetMetadata('role', Role.Mod)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async delete(@Param('id') id: number, @Param('replyId') replyId: number) {
        let thread = await this.threadService.fetch(id)
        let reply = await this.replyService.getReply(replyId, thread)

        return await this.replyService.scrubReply(reply)
    }
}
