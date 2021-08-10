import { Body, Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginDTO, RegisterDTO } from 'src/users/dto/users.dto';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
    constructor(
        private readonly accountService: AccountService
    ) {}
    
    /**
     * POST /register
     * @param req 
     * @returns 
     */
    @Post('/register')
    async register(@Body() req: RegisterDTO) {
        return await this.accountService.register(req)
    }

    /**
     * POST /login
     * @param req 
     */
    @UseGuards(AuthGuard('local'))
    @Post('/login')
    async login(@Request() req) {
        return this.accountService.login(req.user)
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('user')
    async getProfile(@Request() req) {
        return req.user
    }
}
