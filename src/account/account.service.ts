import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/db/entities/user/user.entity';
import { LoginDTO, RegisterDTO } from 'src/users/dto/users.dto';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import bcrypt = require('bcrypt')
import { JwtService } from '@nestjs/jwt';
import { Config } from 'src/config';
import { Avatar } from 'src/db/entities/user/avatar.entity';
import { Item } from 'src/db/entities/shop/item.entity';
import { InventoryItem } from 'src/db/entities/shop/inventory-item.entity';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Avatar)
        private avatarRepository: Repository<Avatar>,
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}
    
    /**
     * Register new user
     * @param payload RegisterDTO
     * @returns Promise<User>
     */
    async register(payload: RegisterDTO): Promise<User>{
        let user = new User()
        user.username = payload.username
        user.password = payload.password
        user.email = payload.email

        // REMOVE ON OFFICIAL RELEASE
        user.beta = true

        let avatar = new Avatar()
        
        try {
            user.avatar = avatar
            
            await avatar.save()
            await user.save()

            /* Do additionally things with user before saving. */

            return user
        } catch (e) {
            console.log(e)
            throw new BadRequestException(['Unknown error code 1'])
        }
    }

    async validateUser(username: string, password: string): Promise<User> {
        try {
            const user = await this.userRepository
                .createQueryBuilder('user')
                .addSelect('user.password')
                .addSelect('user.token')
                .where({username})
                .getOneOrFail()
            if(!user || !(await bcrypt.compare(password, user.password))) {
                throw new Error()
            }
            // User is authenticated
            if(user.token === null) {
                // Refresh the token if the token is null
                user.refreshToken()
                user.save()
            }

            return user
        } catch (e) {
            throw new BadRequestException(['Invalid Credentials'])
        }
    }

    async login(user: User, remember: boolean) {
        // Sub is a standard practice for JWT for user id
        const payload = { sub: user.token }
        return {
            token: this.jwtService.sign(payload, {expiresIn: (remember) ? '30d': Config.defaultExpire}),
        }
    }

    async forceLogout(user: User): Promise<User> {
        user.refreshToken()
        return await user.save()
    }
}
