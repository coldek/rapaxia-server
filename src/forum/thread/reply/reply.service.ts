import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ForumReply } from 'src/db/entities/forum/forum-reply.entity';
import { ForumThread } from 'src/db/entities/forum/forum-thread.entity';
import { Role, User } from 'src/db/entities/user/user.entity';
import { Repository } from 'typeorm';
import { ReplyDTO } from './reply.dto';

@Injectable()
export class ReplyService {
    constructor(
        @InjectRepository(ForumReply)
        private readonly forumReplyRepository: Repository<ForumReply>,
        @InjectRepository(ForumThread)
        private readonly forumThreadRepository: Repository<ForumThread>
    ) {}
    
    async getReply(id: number, thread: ForumThread): Promise<ForumReply> {
        try {
            let reply = await this.forumReplyRepository.findOneOrFail({id, thread})
            return reply
        } catch(e) {
            throw new NotFoundException('Forum reply not found')
        }
    }

    /**
     * 
     * @param thread 
     * @param take 
     * @param skip 
     * @returns 
     */
    async repliesFromThreads(thread: ForumThread, take: any, skip: any) {
        try {
            let replies = await this.forumReplyRepository.findAndCount({where: {thread}, take, skip, relations: ['author', 'quoting']})
            return replies
        } catch (e) {
            throw new NotFoundException('No replies')
        }
    }

    /**
     * Create a reply
     * @param thread The thread
     * @param payload Reply data
     * @param author The author
     * @param quoting Is quoting a reply?
     * @returns 
     */
    async createReply(thread: ForumThread, payload: ReplyDTO, author: User, quoting?: ForumReply) {
        if((thread.locked || thread.pinned) && !author.hasRole(Role.Mod)) throw new UnauthorizedException(['Unable to reply to thread'])

        let reply = await this.forumReplyRepository.save({
            thread,
            quoting,
            author,
            ...payload
        })

        thread.bump = new Date()

        await thread.save()

        return reply
    }

    async scrubReply(reply: ForumReply) {
        reply.scrubbed = !reply.scrubbed
        return await reply.save()
    }
}
