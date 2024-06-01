import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ForumController } from './forum.controller';
import { ForumService } from './forum.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForumTopic } from 'src/db/entities/forum/forum-topic.entity';
import { PaginationMiddleware } from 'src/middleware/pagination.middleware';
import { ForumThread } from 'src/db/entities/forum/forum-thread.entity';
import { ForumReply } from 'src/db/entities/forum/forum-reply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ForumTopic, ForumThread, ForumReply])],
  controllers: [ForumController],
  providers: [ForumService]
})
export class ForumModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PaginationMiddleware)
      .forRoutes(
        { path: 'forum/topics/:topicId', method: RequestMethod.GET },
        { path: 'forum/threads/:threadId', method: RequestMethod.GET}
      )
  }
}
