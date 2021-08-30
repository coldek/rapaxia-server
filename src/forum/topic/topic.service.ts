import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ForumTopic } from 'src/db/entities/forum/forum-topic.entity';
import { Repository } from 'typeorm';
import { TopicDTO } from './topic.dto';

@Injectable()
export class TopicService {
    constructor(
        @InjectRepository(ForumTopic)
        private readonly forumTopicRepository: Repository<ForumTopic>
    ) {}
    
    /**
     * Get all forum topics, sorted by ID.
     * @returns ForumTopic[]
     */
    async getAll(): Promise<ForumTopic[]> {
        let topics = await this.forumTopicRepository.find()

        return topics
    }

    /**
     * Fetch forum topic
     * @param id 
     * @returns 
     */
    async get(slug: string): Promise<ForumTopic> {
        try {
            return await this.forumTopicRepository.findOneOrFail({slug})
        } catch (e) {
            throw new NotFoundException('Topic was not found')
        }
    }

    async update(slug: string, payload: any): Promise<ForumTopic> {
        try {
            let topic = await this.forumTopicRepository.findOneOrFail({slug})

            return await this.forumTopicRepository.save({
                ...topic,
                ...payload
            })
        } catch (e) {
            throw new NotFoundException('Topic was not found')
        }
    }

    async insert (payload: TopicDTO): Promise<ForumTopic> {
        let topic = await this.forumTopicRepository.save(payload)

        return topic
    }

    async delete (id: number): Promise<unknown> {
        return await this.forumTopicRepository.delete(id)
    }
}
