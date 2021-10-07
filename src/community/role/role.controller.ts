import { BadRequestException, Body, ConflictException, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, Res, Response, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response as ResponseType } from 'express';
import { take } from 'rxjs';
import { PermType, PermTypes } from 'src/db/entities/community/community-role.entity';
import { Role } from 'src/db/entities/user/user.entity';
import { IsStrict } from 'src/middleware/is-strict.middleware';
import { CommunityService } from '../community.service';
import { CommunityRoleDTO, PatchCommunityRoleDTO } from '../dto/community-role.dto';
import { PatchCommunityDTO } from '../dto/community.dto';
import { RoleService } from './role.service';

@Controller('community')
export class RoleController {
    constructor(
        private readonly communityService: CommunityService,
        private readonly roleService: RoleService
    ) {}
    
    /**
     * Fetch a role
     * @route GET /community/role/:roleId
     */
    @Get('role/:roleId')
    async fetch(@Param('roleId') roleId: string) {
        return await this.roleService.fetch(roleId)
    }

    /**
     * Create a new role
     * 
     * @todo Only allow the owner to create and update roles
     * @route POST /community/:slug/role
     */
    @Post(':slug/role')
    @IsStrict()
    async create(@Param('slug') slug: string, @Body() payload: CommunityRoleDTO, @Req() {user}) {
        let community = await this.communityService.fetch(slug)
        if(community.creator.id !== user.id) throw new UnauthorizedException(['Insufficient permissions.'])

        if(community.roles.length > 10) throw new ConflictException(['Too many community roles.'])

        let {community: _c, ...rest} = await this.roleService.create(community, payload, user)

        return rest
    }

    /**
     * Update a role
     * 
     * 
     */
    @Patch('role/:roleId')
    @IsStrict()
    async update(@Param('roleId') roleId: string, @Body() data: PatchCommunityRoleDTO, @Req() {user}) {
        let role = await this.roleService.fetch(roleId)
        let community = await this.communityService.fetch(role.communitySlug)
        
        if(community.creator.id !== user.id && !user.hasRole(Role.Mod))
            throw new UnauthorizedException(['Insufficient permissions.'])
        // User can update this now
        return await this.roleService.patch(role, data)
    }

    @Delete('role/:roleId')
    @IsStrict()
    async delete(@Param('roleId') roleId: string, @Req() {user}, @Response() Res: ResponseType) {
        let role = await this.roleService.fetch(roleId)
        let community = await this.communityService.fetch(role.communitySlug)
        if(community.creator.id !== user.id && !user.hasRole(Role.Mod))
            throw new UnauthorizedException(['Insufficient permissions.'])
        if(role.id === community.defaultRoleId)
            throw new ConflictException(['Cannot delete default role of a community.'])

        await this.roleService.delete(role, community)

        Res.send({
            deleted: true
        })
    }
}
