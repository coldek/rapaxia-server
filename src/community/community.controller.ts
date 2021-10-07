import { Body, Controller, Get, Param, Patch, Post, Req, Request, Response, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from 'src/db/entities/user/user.entity';
import { FileManagerService } from 'src/file-manager/file-manager.service';
import { CommunityService } from './community.service';
import { PatchCommunityDTO, PostCommunityDTO } from './dto/community.dto';
import { MemberService } from './member/member.service';
import { Response as ResponseType } from 'express'
import { IsStrict } from 'src/middleware/is-strict.middleware';

@Controller('community')
export class CommunityController {
    constructor(
        private readonly communityService: CommunityService,
        private readonly memberService: MemberService,
        private readonly fileService: FileManagerService
    ) {}
    
    /**
     * Create a community
     * @route POST /community
     * 
     */
    @Post()
    @IsStrict()
    @UseInterceptors(FileInterceptor('file'))
    async create(@Body() data: PostCommunityDTO, @Req() {user}, @UploadedFile() _file: Express.Multer.File) {
        const options = this.fileService.verifyFile(_file, {
            type: 'image/png',
            dimensions: [500, 500]
        })

        return await this.communityService.create(data, user, _file, options)
    }

    /**
     * Fetch a community
     * @route GET /community/:slug
     * 
     */
    @Get('/:slug/info')
    async fetch(@Param('slug') slug: string) {
        let {roleOrder, ...community} = await this.communityService.fetch(slug) 
        return community
    }

    /**
     * Get all communities with pagination
     * @route GET /community
     */
    @Get()
    async fetchMany(@Response() res: ResponseType) {
        let {take, skip} = res.locals.paginate
        res.send(
            await this.communityService.fetchMany({take, skip})
        )
    }

    /**
     * Update a community.
     * @route PATCH /community/:slug
     * 
     */
    @Patch('/:slug/update')
    @IsStrict()
    async patch(@Param('slug') slug: string, @Req() {user}, @Body() data: PatchCommunityDTO) {
        let community = await this.communityService.fetch(slug)
        let member = await this.memberService.fetchOrFail(slug, user.id)

        // If the user is not an admin, does not have a role that allows editing of community, and is not the creator.
        if(!user.hasRole(Role.Mod) && !member.role.perms.includes('communityEdit') && user.id !== community.creator.id) throw new UnauthorizedException(['Invalid permissions.'])

        return await this.communityService.patch(community, data, member)
    }
}
