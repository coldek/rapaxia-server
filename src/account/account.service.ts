import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/db/user.entity';
import { LoginDTO, RegisterDTO } from 'src/users/dto/users.dto';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import bcrypt = require('bcrypt')
import { JwtService } from '@nestjs/jwt';
import { Config } from 'src/config';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
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

        try {
            return await user.save()
        } catch (e) {
            throw new BadRequestException(['Username was taken'])
        }
    }

    async validateUser(username: string, password: string): Promise<User> {
        try {
            const user = await this.userRepository
                .createQueryBuilder('user')
                .addSelect('user.password')
                .where({username})
                .getOneOrFail()
            if(!user || !(await bcrypt.compare(password, user.password))) {
                throw new Error()
            }
            return user
        } catch (e) {
            throw new BadRequestException('Invalid Credentials')
        }
    }

    async login(user: User, remember?: boolean) {
        // Sub is a standard practice for JWT for user id
        const payload = { username: user.username, sub: user.id }
        return {
            access_token: this.jwtService.sign(payload, {expiresIn: (remember) ? '30d': Config.defaultExpire})
        }
    }
}
