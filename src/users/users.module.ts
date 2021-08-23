import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/db/entities/user/user.entity';
import { UserExistsRule } from './dto/users-exists.decorator';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, UserExistsRule],
  controllers: [UsersController]
})
export class UsersModule {}
