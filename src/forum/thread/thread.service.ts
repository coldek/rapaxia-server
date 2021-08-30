import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ForumThread } from 'src/db/entities/forum/forum-thread.entity';
import { ForumTopic } from 'src/db/entities/forum/forum-topic.entity';
import { Role, User } from 'src/db/entities/user/user.entity';
import { Repository } from 'typeorm';
import { ThreadDTO, UpdateThreadDTO } from './thread.dto';

@Injectable()
export class ThreadService {
    constructor(
        @InjectRepository(ForumThread)
        private readonly forumThreadRepository: Repository<ForumThread>
    ) {}
    
    async fetch(id: number, withReplies = false): Promise<any> {
        try {
            // let thread = await this.forumThreadRepository.findOneOrFail(id)
            let thread = this.forumThreadRepository.createQueryBuilder('forum_thread')
                .innerJoinAndSelect('forum_thread.author', 'user')
                .innerJoinAndSelect('user.avatar', 'avatar')
                .where('forum_thread.id = :id', {id})
            if(withReplies) {thread.loadRelationCountAndMap('forum_thread.replies', 'forum_thread.replies')}
            return await thread.getOneOrFail()
        } catch (e) {
            throw new NotFoundException('Forum thread was not found')
        }
    }

    async fetchThreads(topic: ForumTopic, take: any, skip: any){
        // Big ass query for fetching threads
        let threads = await this.forumThreadRepository.createQueryBuilder('forum_thread')
            .innerJoinAndSelect('forum_thread.topic', 'topic')
            .innerJoinAndSelect('forum_thread.author', 'user')
            .innerJoinAndSelect('user.avatar', 'avatar')
            .where('topic.id = :tId', {tId: topic.id})
            .loadRelationCountAndMap('forum_thread.replies', 'forum_thread.replies')
            .orderBy('forum_thread.bump', 'DESC')
            .take(take)
            .skip(skip)
            .getManyAndCount()
        return threads
    }

    /**
     * Create a thread
     * @param user The author
     * @param topic Forum topic
     * @param payload Payload
     * @returns 
     */
    async create(user: User, topic: ForumTopic, payload: ThreadDTO): Promise<ForumThread> {
        if(!user.hasRole(topic.role)) throw new ForbiddenException(['Unathorized to post on this topic'])

        let newThread = {
            title: payload.title,
            body: payload.body,
            author: user,
            topic,
            locked: false,
            pinned: false,
        }

        // If the user is a mod, then push the locked and pinned.
        if(user.hasRole(Role.Mod)) {
            let {locked, pinned} = payload
            newThread = {...newThread, locked, pinned}
        }

        return await this.forumThreadRepository.save(newThread)
    }

    async patch(thread: ForumThread, payload: UpdateThreadDTO): Promise<ForumThread> {
        // If scrubbed is provided 
        
        return await this.forumThreadRepository.save({
            ...thread,
            ...payload
        })
    }

    async view(thread: ForumThread) {
        thread.views += 1
        return await thread.save()
    }
}
