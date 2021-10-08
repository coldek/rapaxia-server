import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { FriendsService } from 'src/friends/friends.service';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly friendsService: FriendsService
    ) {}

    @Get()
    findAll(){
        return this.usersService.findAll()
    }

    @Get(':id')
    async findOne(@Param('id') id: number, @Req() {user}){
        let fetchedUser = await this.usersService.findOne(id)

        const isFriend = (user !== null) ? await this.friendsService.isFriends(user.id, fetchedUser.id): undefined

        return {
            ...fetchedUser,
            isFriend
        }
    }
}
