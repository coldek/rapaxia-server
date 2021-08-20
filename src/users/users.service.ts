import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getCols } from 'src/db/abstract-entity';
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
        return this.usersRepository.find({relations: ['avatar']})
    }

    async findOne(payload: any): Promise<User> {
        return this.usersRepository.findOne(payload)
    }

    async getAll(id: number) {
        let {password, token, ...user} = await this.usersRepository.findOne({select: getCols(this.usersRepository), where: {id}})
        return user
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
