import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from 'src/db/entities/user/friends.entity';
import { User } from 'src/db/entities/user/user.entity';
import { Brackets, Repository } from 'typeorm';

@Injectable()
export class FriendsService {
    constructor(
        @InjectRepository(Friend) 
        private readonly friendsRepository: Repository<Friend>
    ) {}
    
    /**
     * Find a friend instance from the ID of two users.
     * @param uid1 One user
     * @param uid2 Another user
     * @returns Undefined or instance of the friend
     */ 
    async getFriend(uid1: number, uid2: number): Promise<Friend> {
        return await this.friendsRepository.createQueryBuilder()
            .where(new Brackets(qb => {
                qb.where('friend.senderId = :sender1', {sender1: uid1})
                .orWhere('friend.senderId = :sender2', {sender2: uid2})
            }))
            .andWhere(new Brackets(qb => {
                qb.where('friend.receiverId = :receiver1', {receiver1: uid1})
                .orWhere('friend.receiverId = :receiver2', {receiver2: uid2})
            }))
            .getOne()
    }

    /**
     * Find the instance of the frined by the UUID.
     * @param fid UUID of the friend instance
     * @returns Instance of the friend, throws an error if not found
     */
    async getFriendFromIdOrFail(fid: string): Promise<Friend> {
        try {
            return await this.friendsRepository.findOneOrFail(fid)
        } catch (e) {
            throw new NotFoundException(['Friend instance not found.'])
        }
    }

    /**
     * Attempt to find a friend instance, throws an error if not found.
     * @param uid1 One user
     * @param uid2 Another user
     * @returns Returns getFriend() or throws an error.
     */
    async getFriendOrFail(uid1: number, uid2: number): Promise<Friend> {
        let friend = await this.getFriend(uid1, uid2)

        if(friend === undefined) {
            throw new NotFoundException(['User is not friends with this user.'])
        }

        return friend
    }

    /**
     * Check two users are friends with each other
     * @param uid1 One user
     * @param uid2 Another user
     * @returns Whether or not a relationship exists between two users
     */
    async isFriends(uid1: number, uid2: number): Promise<boolean> {
        let query = await this.getFriend(uid1, uid2)
        return query !== undefined
    }

    /**
     * Send a friend request
     * @param sender Instance of the sender (typically local user)
     * @param receiver Instance of the recipient
     * @returns Instance of a friend
     */
    async createFriend(sender: User, receiver: User): Promise<Friend> {
        return await this.friendsRepository.create({
            sender,
            receiver
        }).save()
    }

    /**
     * Either remove a friend or decline a friend request
     * @param friend Instance of the friend
     */
    async deleteFriend(friend: Friend): Promise<Friend> {
        return await friend.remove()
    }

    /**
     * Accept a friend
     * @param friend Instance of the friend
     * @returns 
     */
    async acceptFriend(friend: Friend): Promise<Friend> {
        friend.accepted = true
        return await friend.save()
    }

    /**
     * Fetch friends of user
     * @param user Friends of the user
     * @param options Take & skip
     * @returns Friends of all users paginated
     */
    async getMany(user: User, options: {take: number, skip: number}): Promise<[User[], number]> {
        let raw = await this.friendsRepository.createQueryBuilder('friend')
            .leftJoinAndSelect('friend.sender', 'sender')
            .leftJoinAndSelect('friend.receiver', 'receiver')
            .leftJoinAndSelect('sender.avatar', 'senderAvatar')
            .leftJoinAndSelect('receiver.avatar', 'receiverAvatar')
            .where(new Brackets(qb => {
                qb.where('friend.senderId = :uid', {uid: user.id})
                .orWhere('friend.receiverId = :uid')
            }))
            .andWhere('friend.accepted = 1')
            .getManyAndCount()
        return [raw[0].map(friend => {
            if(friend.receiverId === user.id)
                return friend.sender
            else
                return friend.receiver
        }), raw[1]]
    }
}
