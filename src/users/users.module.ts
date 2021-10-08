import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from 'src/db/entities/user/friends.entity';
import { User } from 'src/db/entities/user/user.entity';
import { FriendsService } from 'src/friends/friends.service';
import { UserExistsRule } from './dto/users-exists.decorator';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Friend])],
  providers: [UsersService, UserExistsRule, FriendsService],
  controllers: [UsersController]
})
export class UsersModule {}
