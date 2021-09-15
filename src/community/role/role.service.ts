import { BadGatewayException, BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { CommunityMember } from 'src/db/entities/community/community-member.entity';
import { CommunityRole } from 'src/db/entities/community/community-role.entity';
import { Community } from 'src/db/entities/community/community.entity';
import { Role, User } from 'src/db/entities/user/user.entity';
import { Repository } from 'typeorm';
import { CommunityService } from '../community.service';
import { CommunityRoleDTO, PatchCommunityRoleDTO } from '../dto/community-role.dto';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(CommunityRole)
        private roleRepository: Repository<CommunityRole>,
        @InjectRepository(CommunityMember)
        private memberRepository: Repository<CommunityMember>,
        @InjectRepository(Community)
        private communityRepository: Repository<Community>,
        private communityService: CommunityService
    ) {}

    async fetch(roleId: string, search?: string): Promise<CommunityRole> {
        try {
            return await this.roleRepository.findOneOrFail(roleId)
        } catch (e) {
            throw new NotFoundException(['Role was not found.'])
        }
    }

    async create(community: Community, data: CommunityRoleDTO, user: User): Promise<CommunityRole> {
        let role = new CommunityRole()
        role.community = community
        role.perms = data.perms
        role.name = data.name
        await role.save()
        
        // Push into community
        let roleOrder = community.roleOrder
        roleOrder.splice(1, 0, role.id)

        await this.communityRepository.save({
            slug: community.slug,
            roleOrder
        })

        return role
    }

    async patch(role: CommunityRole, data: PatchCommunityRoleDTO): Promise<CommunityRole> {
        let {order, ...roleData} = data

        let community = await this.communityService.fetch(role.communitySlug)

        if(order !== undefined) {
            // Re-order the roles

            // Check if each role is valid
            if(community.roles.length !== order.length) throw new BadRequestException(['Invalid input.'])

            // Format for sql
            let queryText = order.map((value, index) => '?').join(',')

            let query = await this.communityRepository.query(`SELECT COUNT(*) as count FROM \`community\` INNER JOIN \`community_role\` ON \`community_role\`.\`communitySlug\` = \`community\`.\`slug\` WHERE \`community\`.\`slug\` = ? AND \`community_role\`.\`id\` IN (${queryText})`, [role.communitySlug, ...order])
            
            let count = parseInt(query[0].count)

            if(count !== order.length) throw new BadRequestException(['Invalid input.'])

            // Everything is seemingly good. Update the community now.
            await this.communityRepository.save({
                slug: community.slug,
                roleOrder: order
            })
        }
        try {

            return await this.roleRepository.save(
                {
                    ...role,
                    ...roleData
                }
            )
        } catch (e) {
            throw new BadGatewayException(['Invalid input.'])
        }
    }

    async delete(role: CommunityRole, community: Community) {
        try {
            let query = await this.memberRepository.createQueryBuilder()
                .update()
                .set({
                    roleId: community.defaultRoleId
                })
                .where({
                    roleId: role.id
                })
                .execute()
            await role.remove()
        } catch (e) {
            console.log(e)
            throw new BadGatewayException(['Unexpected error.'])
        }
    }

    async compare(community: Community, role: CommunityRole, roleToCompare: CommunityRole): Promise<boolean> {
        let order = community.roleOrder
        let roleKey = order.indexOf(role.id)
        let roleToCompareKey = order.indexOf(roleToCompare.id)

        console.log({roleToCompareKey, roleKey}, roleToCompareKey >= roleKey)

        if(roleToCompareKey >= roleKey) return false
        return true
    }
}
