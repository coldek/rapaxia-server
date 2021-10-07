import { BadRequestException, Controller, Delete, Get, NotFoundException, Param, Post, Req, Response, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { FriendsService } from './friends.service';
import {Response as ResponseType} from 'express'

@Controller('friends')
export class FriendsController {
    constructor(
        private readonly friendsService: FriendsService,
        private readonly usersService: UsersService,
    ) {}
    
    // Send a friend request
    @Post('/user/:uid')
    @UseGuards(AuthGuard('jwt'))
    async send(@Param('uid') uid: number, @Req() {user}) {
        if(uid == user.id)
            throw new BadRequestException(['You cannot send a friend request to yourself.'])
        let receiver = await this.usersService.findOne(uid)
        if(await this.friendsService.isFriends(user.id, receiver.id))
            throw new BadRequestException(['You are already friends with this user.'])
        return await this.friendsService.createFriend(user, receiver)
    }

    // Get relationship of user
    @Get('/view/:uid1/:uid2')
    async getFriend(@Param('uid1') uid1: number, @Param('uid2') uid2: number) {
        return await this.friendsService.getFriendOrFail(uid1, uid2)
    }

    @Get('/view/:fid')
    async getFriendFromId(@Param('fid') fid: string) {
        try {
            return await this.friendsService.getFriendFromIdOrFail(fid)
        } catch (e) {
            throw new NotFoundException(['Friend instance not found.'])
        }
    }

    @Delete('/:fid/remove')
    @UseGuards(AuthGuard('jwt'))
    async removeFriend(@Param('fid') fid: string, @Req() {user}) {
        let friend = await this.friendsService.getFriendFromIdOrFail(fid)

        if(!friend.isFriend(user.id))
            throw new UnauthorizedException()
        
        return await this.friendsService.deleteFriend(friend)
    }

    @Post('/:fid/accept')
    @UseGuards(AuthGuard('jwt'))
    async acceptFriend(@Param('fid') fid: string, @Req() {user}) {
        let friend = await this.friendsService.getFriendFromIdOrFail(fid)

        if(friend.receiverId !== user.id)
            throw new UnauthorizedException()
        if(friend.accepted === true)
            throw new BadRequestException(['You have already accepted this friend.'])
        return await this.friendsService.acceptFriend(friend)
    }

    @Get('/user/:uid')
    async getMany(@Param('uid') uid: number, @Response() res: ResponseType) {
        let {take, skip} = res.locals.paginate

        let user = await this.usersService.findOne(uid)

        res.send(await this.friendsService.getMany(user, {take, skip}))
    }
}
