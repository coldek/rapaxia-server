import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getCols } from 'src/db/entities/abstract-entity';
import { User } from 'src/db/entities/user/user.entity';
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
        let user = await this.usersRepository.findOne(payload, {relations: ['avatar', 'inventory']})
        if(!user) throw new NotFoundException('User was not found')
        return user
    }

    async getAll(id: number) {
        let {password, token, ...user} = await this.usersRepository.findOne({select: getCols(this.usersRepository), where: {id}, relations: ['avatar']})
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
