import { Controller, Get, Param, Post, Req, UnauthorizedException, UseGuards, Response, Delete, NotFoundException, Patch, Body, ConflictException, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommunityService } from '../community.service';
import { RoleService } from '../role/role.service';
import { MemberService } from './member.service';
import { Response as ResponseType } from 'express'
import { Role } from 'src/db/entities/user/user.entity';
import { CommunityMemberDTO } from '../dto/community-member.dto';
import { IsStrict } from 'src/middleware/is-strict.middleware';

@Controller('community')
export class MemberController {
    constructor(
        private readonly memberService: MemberService,
        private readonly communityService: CommunityService,
        private readonly roleService: RoleService
    ) {}
    
    /**
     * Get a community member from community slug and user id
     * @route /community/:slug/member/:uid
     */
    @Get(':slug/member/:uid')
    async fetch(@Param('slug') slug:string, @Param('uid') uid: number) {
        return await this.memberService.fetchOrFail(slug, uid)
    }

    /**
     * Join a community (requires authentication)
     * @route POST /community/:slug/member
     */
    @Post(':slug/member')
    @IsStrict()
    async create(@Param('slug') slug:string, @Req() {user}) {
        let community = await this.communityService.fetch(slug)

        if(!(await this.memberService.canJoin(community, user))) throw new UnauthorizedException(['Unable to join community.'])

        return await this.memberService.create(community, user)
    }

    /**
     * Get all community members of a role with pagination
     * @route GET /community/role/:roleId/members
     */
    @Get('role/:roleId/members')
    async fetchMembers(
        @Param('roleId') roleId: string,
        @Response() res: ResponseType
    ) {
        let role = await this.roleService.fetch(roleId)
        let {take, skip} = res.locals.paginate

        res.send(
            await this.memberService.fetchMany(role, {take, skip})
        )
    }

    @Patch('member/:mid')
    @IsStrict()
    async giveRole(@Req() {user}, @Param('mid') mid: string, @Body() {role: _role}: CommunityMemberDTO) {
        let member = await this.memberService.fetchFromIdOrFail(mid)
        let role = await this.roleService.fetch(_role)
        let community = member.community

        if(member.user.id === user.id) throw new BadRequestException(['Cannot give self role.'])

        if(member.community.slug !== role.communitySlug) throw new ConflictException(['Role is not in member\'s community.'])

        // If the local user isn't the creator nor a moderator
        if(!user.hasRole(Role.Mod) && community.creator.id !== user.id)
        {
            if(member.user.id === community.creator.id) throw new UnauthorizedException(['Cannot change the creator\'s roles.'])

            let localMember = await this.memberService.fetchOrFail(community.slug, user.id)
            
            if(!localMember.role.perms.includes('membersRole')) throw new UnauthorizedException(['Insufficient permissions'])

            // Compare the local member's role with the affected member's role
            if(!this.roleService.compare(community, localMember.role, member.role) || !this.roleService.compare(community, localMember.role, role)) throw new UnauthorizedException(['Invalid permissions'])

            // All clear!
        }

        member.role = role
        return await member.save()
    }

    @Delete('member/:mid/kick')
    @IsStrict()
    async kickMember(@Req() {user}, @Param('mid') mid: string, @Response() res: ResponseType) {
        let member = await this.memberService.fetchFromIdOrFail(mid)

        if(member.user.id === member.community.creator.id) throw new BadRequestException(['Cannot kick the creator of a community.'])
        if(member.user.id === user.id) throw new BadRequestException(['Cannot kick yourself.'])

        // If the local user isn't a site-wide mod, do some checks
        if(!user.hasRole(Role.Mod))
        {
            let localMember = await this.memberService.fetchOrFail(member.community.slug, user.id)

            if(!localMember.role.perms.includes('membersKick'))
                throw new UnauthorizedException(['Insufficient permissions.'])
        }

        await member.remove()

        res.send(
            {
                deleted: true
            }
        )
    }

    /**
     * 
     * @author test this 
     */
    @Delete('member/:mid/ban')
    @IsStrict()
    async banMember(@Req() {user}, @Param('mid') mid: string, @Response() res: ResponseType) {
        let member = await this.memberService.fetchFromIdOrFail(mid)
        
        if(member.community.creator.id === member.user.id) throw new UnauthorizedException(['Cannot ban the creator of this community.'])
        if(member.user.id === user.id) throw new BadRequestException(['Cannot ban yourself.'])

        // If the user is not a mod, we need to check permissions.
        if(!user.hasRole(Role.Mod))
        {
            let localMember = await this.memberService.fetchOrFail(member.community.slug, user.id)
            
            // If the local member is the creator, we don't need to check for his permissions.
            if(member.community.creator.id !== localMember.user.id)
            {
                // If the role doesn't even have the permission to ban
                if(!localMember.role.perms.includes('membersBan'))
                    throw new UnauthorizedException(['Insufficient permissions.'])
                

                // Check to see if the role can effect the members of the other role
                if(!this.roleService.compare(member.community, localMember.role, member.role)) throw new UnauthorizedException(['Invalid permissions.'])
            }
        }

        await this.memberService.ban(member)

        res.send(
            {
                deleted: true
            }
        )
    }

    @Post(':slug/ban/:uid')
    @IsStrict()
    async pardon(@Param('slug') slug: string, @Param('uid') uid: number, @Req() {user}) {
        let community = await this.communityService.fetch(slug)
        let member = await this.memberService.fetchOrFail(slug, user.id)

        if(!member.role.perms.includes('membersBan') && member.user.id !== community.creator.id && !user.hasRole(Role.Mod)) throw new UnauthorizedException(['Insufficient permissions.'])


        return await this.memberService.pardon(community, uid)
    }
}
