import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from 'src/db/entities/user/friends.entity';
import { User } from 'src/db/entities/user/user.entity';
import { PaginationMiddleware } from 'src/middleware/pagination.middleware';
import { UsersService } from 'src/users/users.service';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Friend])
  ],
  controllers: [FriendsController],
  providers: [FriendsService, UsersService]
})
export class FriendsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PaginationMiddleware)
      .forRoutes(
        { path: 'friends/user/:uid', method: RequestMethod.GET },
      )
  }
}
