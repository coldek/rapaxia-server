import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/db/user.entity';
import { Repository } from 'typeorm';
import { RegisterDTO } from './dto/users.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    async findAll(): Promise<User[]> {
        return this.usersRepository.find()
    }

    async findOne(payload: any): Promise<User> {
        return this.usersRepository.findOne(payload)
    }

    async create(username: string, pass: string): Promise<User> {
        let user = new User()
        user.username = username
        user.password = pass
        try {
            return await this.usersRepository.save(user)
        } catch (e) {
            throw new BadRequestException('Username taken')
        }
    }
}
