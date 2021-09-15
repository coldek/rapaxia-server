import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommunityMember } from 'src/db/entities/community/community-member.entity';
import { CommunityRole } from 'src/db/entities/community/community-role.entity';
import { Community } from 'src/db/entities/community/community.entity';
import { Role, User } from 'src/db/entities/user/user.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CommunityService } from '../community.service';

@Injectable()
export class MemberService {
    constructor(
        private communityService: CommunityService,
        @InjectRepository(CommunityMember)
        private communityMemberRepository: Repository<CommunityMember>,
        @InjectRepository(Community)
        private communityRepository: Repository<Community>
    ) {}
    
    /**
     * Generate a query builder for finding the community member
     * @param slug Slug of the community
     * @param uid User ID
     * @returns TypeORM Query Builder for fetching community member
     */
    private selectQuery(slug: string, uid: number): SelectQueryBuilder<CommunityMember> {
        return this.communityMemberRepository.createQueryBuilder('community_member')
            .select()
            // .innerJoinAndSelect('community_member.user', 'user')
            // .innerJoinAndSelect('user.avatar', 'avatar')
            // .innerJoinAndSelect('community_member.community', 'community')
            .innerJoinAndSelect('community_member.role', 'community_role')
            .innerJoinAndSelect('community_member.user', 'user')
            .where('community_member.userId = :uid', {uid})
            .andWhere('community_member.communitySlug = :slug', {slug})
    }

    /**
     * Attempt to find the community member.
     * @param slug Slug of the community
     * @param uid User ID
     * @returns Member info: Role
     */
    async fetch(slug: string, uid: number): Promise<CommunityMember> {
        // console.log(this.selectQuery(slug, uid).getQueryAndParameters())
        // try {
        //     console.log(this.selectQuery(slug, uid).getQueryAndParameters())
        return await this.selectQuery(slug, uid).getOne()
        // } catch (e) {
        //     console.log(e)
        // }
    }

    /**
     * Attempt to find the community member. Throws an error if the member does not exist
     * @param slug Slug of the community
     * @param uid User ID
     * @returns Member info: Role, 
     */
    async fetchOrFail(slug: string, uid: number): Promise<CommunityMember> {
        try {
            return await this.selectQuery(slug, uid).getOneOrFail()
        } catch (e) {
            throw new NotFoundException(['Community member not found.'])
        }
    }

    async canJoin(community: Community, user: User): Promise<boolean> {
        let member = await this.fetch(community.slug, user.id)
        if(member !== undefined) return false // User exists so return false

        if(user.hasRole(Role.Mod)) return true // If the user is a mod. Never should be banned, but just in case.

        let ban = await this.communityRepository.createQueryBuilder('community')
            .innerJoin('community.bans', 'user', 'user.id = :uid', {uid: user.id})
            .where('slug = :slug', {slug: community.slug})
            .getOne()
        if(ban !== undefined) return false
        // Is not banned, pretty much everything.

        // TODO check how many communities the user is in
        return true
    }

    /**
     * Join community
     * @param slug Slug of the community
     * @param user User requesting to join
     */
    async create(community: Community, user: User) {
        let member = new CommunityMember()
        member.community = community
        member.roleId = community.defaultRoleId
        member.user = user

        member.approved = !community.private

        return await member.save()
    }

    /**
     * Fetch multiple members from a role
     * @param role Role
     * @param options take & skip
     * @returns Returns members and number of total members
     */
    async fetchMany(role: CommunityRole, options: { take: number, skip: number }): Promise<[CommunityMember[], number]> {
        return await this.communityMemberRepository.createQueryBuilder('community_member')
            .leftJoinAndSelect('community_member.user', 'user')
            .leftJoinAndSelect('user.avatar', 'avatar')
            .where('community_member.roleId = :roleId', {roleId: role.id})
            .take(options.take)
            .skip(options.skip)
            .getManyAndCount()
    }

    async fetchFromIdOrFail(mid: string): Promise<CommunityMember> {
        try {
            return await this.communityMemberRepository.findOneOrFail(mid, {relations: ['community', 'community.creator', 'user', 'role']})
        } catch (e) {
            throw new NotFoundException(['Community member not found.'])
        }
    }

    async ban(member: CommunityMember): Promise<void> {
        let query = await this.communityRepository.createQueryBuilder()
            .relation(Community, 'bans')
            .of(member.community)
            .add(member.user)
        await member.remove()
    }

    async pardon(community: Community, user: number) {
        let ban = await this.communityRepository.query('SELECT * FROM `community_bans_user` WHERE `community_bans_user`.`communitySlug` = ? AND `community_bans_user`.`userId` = ?', [community.slug, user])
        if(ban.length === 0) throw new NotFoundException(['Ban not found.'])

        await this.communityRepository.query('DELETE FROM `community_bans_user` WHERE `community_bans_user`.`communitySlug` = ? AND `community_bans_user`.`userId` = ?', [community.slug, user])

        return {
            pardoned: true
        }
    }
}
