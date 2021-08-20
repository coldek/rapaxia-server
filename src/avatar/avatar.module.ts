import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/db/user.entity';
import { AvatarController } from './avatar.controller';
import { AvatarService } from './avatar.service';

@Module({
  controllers: [AvatarController],
  providers: [AvatarService],
  imports: [TypeOrmModule.forFeature([User])]
})
export class AvatarModule {}
