import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ForumThread } from 'src/db/entities/forum/forum-thread.entity';
import { ForumTopic } from 'src/db/entities/forum/forum-topic.entity';
import { Not, Repository } from 'typeorm';
import { CreateForumThreadDto } from './dto/forum-thread.dto';
import { User } from 'src/db/entities/user/user.entity';
import { ForumReply } from 'src/db/entities/forum/forum-reply.entity';
import { CreateForumReplyDto } from './dto/forum-reply.dto';

@Injectable()
export class ForumService {
    constructor(
        @InjectRepository(ForumTopic)
        private readonly forumTopicRepository: Repository<ForumTopic>,
        @InjectRepository(ForumThread)
        private readonly forumThreadRepository: Repository<ForumThread>,
        @InjectRepository(ForumReply)
        private readonly forumReplyRepository: Repository<ForumReply>
    ) {}

    async fetchTopics(): Promise<[ForumTopic[], number]> {
        try {
            let forumTopics = await this.forumTopicRepository.findAndCount({})

            return forumTopics
        } catch(e) {
            throw new NotFoundException(['No forum topics found'])
        }
    }

    async fetchTopic(topicId: number) {
        try {
            return await this.forumTopicRepository.findOneOrFail(topicId)
        } catch(e) {
            throw new NotFoundException(["Forum topic not found"])
        }
    }

    async fetchThreads(fTopicId: number, take: number, skip: number): Promise<[ForumThread[], number]> {
        try {

            // let threads = await this.forumThreadRepository.findAndCount({
            //     select: {
            //         id: true,
            //         title: true
            //     },
            //     where: {
            //         topic: {
            //             id: fTopicId
            //         }
            //     },
            //     skip, take
            // })
            let threads = await this.forumThreadRepository.createQueryBuilder('thread')
                .leftJoinAndSelect('thread.author', 'user')
                .leftJoinAndSelect('thread.topic', 'topic')
                .leftJoinAndSelect('thread.bumped_by', 'bumped_by')
                .leftJoinAndSelect('user.avatar', 'avatar')
                .loadRelationCountAndMap('thread.replies', 'thread.replies')
                .where('topic.id = :topicId', {topicId: fTopicId})
                .select([
                    'thread.id',
                    'thread.title',
                    'thread.bumped',
                    'user.username',
                    'avatar.cache',
                    'bumped_by.username'
                ])
                .orderBy('bumped', 'DESC')
                .limit(take)
                .offset(skip)
                .getManyAndCount()
            return threads
        } catch(e) {
            throw new NotFoundException(['No forum threads found'])
        }
    }

    async createThread(user: User, topicId: number, payload: CreateForumThreadDto) {
        try {
            let topic = await this.forumTopicRepository.findOneOrFail({
                id: topicId
            })

            let thread = new ForumThread()
            thread.body = payload.body
            thread.title = payload.title
            thread.author = user
            thread.topic = topic
            thread.bumped = new Date()

            await thread.save()

            return thread
        } catch(e) {
            throw new BadRequestException(['Invalid request'])
        }
    }

    async getThread(threadId: number): Promise<ForumThread> {
        try {
            // return await this.forumThreadRepository
            //     .createQueryBuilder('thread')
            //     .innerJoinAndSelect('thread.topic', 'topic')
            //     .loadRelationCountAndMap(
            //         'thread.replies_count', 'thread.replies', 'reply',
            //         qb => qb
            //             .take(2)
            //             .skip(0)
            //     )
            //     .where({
            //         id: threadId
            //     })
            //     .orderBy('reply.id', 'ASC')
            //     .getOneOrFail()

            return await this.forumThreadRepository
                .findOneOrFail(threadId)
        } catch(e) {
            throw new NotFoundException(["Forum thread not found"])
        }
    }

    async getReplies(
        thread: ForumThread, take: number, skip: number
    ): Promise<ForumReply[]> {
        return await this.forumReplyRepository.find({
            where: { thread },
            take, skip
        })
    }

    async createReply(
        thread: ForumThread,
        payload: CreateForumReplyDto,
        user: User,
        quoting?: ForumReply
    ) {
        let reply = new ForumReply()
        reply.body = payload.body
        reply.thread = thread
        reply.author = user
        reply.quoting = quoting

        await reply.save()
        return reply
    }
}
