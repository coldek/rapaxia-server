import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ShopService } from './shop.service';

@Controller('shop')
export class ShopController {
    constructor(
        private readonly shopService: ShopService
    ) {}

    @Get()
    async getAll() {
        return await this.shopService.getAll()
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@Request() req) {
        return this.shopService.create(req.user)
    }
}
