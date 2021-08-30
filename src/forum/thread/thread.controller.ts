import { Body, Controller, Delete, Get, Param, Patch, Post, Req, SetMetadata, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import { RolesGuard } from 'src/account/strategies/roles.guard';
import { Role } from 'src/db/entities/user/user.entity';
import { UpdateThreadDTO } from './thread.dto';
import { ThreadService } from './thread.service';

@Controller('forum/thread')
export class ThreadController {
    constructor(
        private readonly threadService: ThreadService
    ) {}
    
    /**
     * GET thread based on ID
     * @param id 
     * @param request 
     * @returns 
     */
    @Get('/:id')
    async getThread(@Param('id') id: number) {
        return await this.threadService.fetch(id, true)
    }

    /**
     * Update a thread. Requires authenticated user to be a mod or own the thread.
     * @param id 
     * @param request 
     * @param body 
     * @returns 
     */
    @Patch('/:id')
    @UseGuards(AuthGuard('jwt'))
    async patch(@Param('id') id: number, @Req() request, @Body() body: UpdateThreadDTO) {
        let thread = await this.threadService.fetch(id)
        let author = await thread.author

        if(author.id !== request.user.id && !request.user.hasRole(Role.Mod)) throw new UnauthorizedException()

        return await this.threadService.patch(thread, body)
    }

    /**
     * Scrub the thread.
     * @todo LOG THE ACTION
     * @param id 
     * @param req 
     * @returns 
     */
    @Delete('/:id')
    @SetMetadata('role', Role.Mod)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async delete(@Param('id') id: number, @Req() req){
        let thread = await this.threadService.fetch(id)

        thread.scrubbed = !thread.scrubbed
        return await thread.save()
    }

    // @Post('/:id/view')
    // @UseGuards(AuthGuard('jwt'))
    // @Throttle(1, 10)
    // async viewThread(@Param('id') id: number) {
    //     let thread = await this.threadService.fetch(id)

    //     return await this.threadService.view(thread)
    // }
}
