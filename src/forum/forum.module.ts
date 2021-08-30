import { Module } from '@nestjs/common';
import { ForumController } from './forum.controller';
import { ForumService } from './forum.service';
import { TopicController } from './topic/topic.controller';
import { ThreadController } from './thread/thread.controller';
import { ReplyController } from './thread/reply/reply.controller';
import { TopicService } from './topic/topic.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForumTopic } from 'src/db/entities/forum/forum-topic.entity';
import { ThreadService } from './thread/thread.service';
import { ForumThread } from 'src/db/entities/forum/forum-thread.entity';
import { ReplyService } from './thread/reply/reply.service';
import { ForumReply } from 'src/db/entities/forum/forum-reply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ForumTopic, ForumThread, ForumReply])],
  controllers: [ForumController, TopicController, ThreadController, ReplyController],
  providers: [ForumService, TopicService, ThreadService, ReplyService]
})
export class ForumModule {}
