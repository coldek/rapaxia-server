import { Body, Controller, Post, UseGuards, Request, Get, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IsStrict } from 'src/middleware/is-strict.middleware';
import { LoginDTO, RegisterDTO } from 'src/users/dto/users.dto';
import { UsersService } from 'src/users/users.service';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
    constructor(
        private readonly accountService: AccountService,
        private readonly usersService: UsersService
    ) {}
    
    /**
     * POST /register
     * @param req 
     * @returns 
     */
    @Post('/register')
    async register(@Body() req: RegisterDTO) {
        let {password, token, ...rest} = await this.accountService.register(req)
        return rest
    }

    /**
     * POST /login
     * @param req 
     */
    @UseGuards(AuthGuard('local'))
    @Post('/login')
    async login(@Request() req) {
        return this.accountService.login(req.user, req.body.remember)
    }

    @Get('/user')
    @IsStrict()
    async getProfile(@Request() req) {
        return {user: await this.usersService.getAll(req.user.id)}
    }

    @Post('/logout')
    @IsStrict()
    async logout(@Request() {user}) {
        return await this.accountService.forceLogout(user)
    }

    @Get('/pull')
    @IsStrict()
    async pull(@Req() {user}) {
        await user.updateSeen()

        return await this.accountService.getNotifications(user)
    }
}
