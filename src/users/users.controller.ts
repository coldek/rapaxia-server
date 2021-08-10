import { Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @Get()
    findAll(){
        return this.usersService.findAll()
    }

    @Get(':id')
    async findOne(@Param('id') id: number){
        return await this.usersService.findOne(id)
    }
}
