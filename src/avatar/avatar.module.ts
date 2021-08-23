import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avatar } from 'src/db/entities/user/avatar.entity';
import { User } from 'src/db/entities/user/user.entity';
import { AvatarController } from './avatar.controller';
import { AvatarService } from './avatar.service';

@Module({
  controllers: [AvatarController],
  providers: [AvatarService],
  imports: [TypeOrmModule.forFeature([User, Avatar])]
})
export class AvatarModule {}
