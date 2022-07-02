import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommunityMember } from 'src/db/entities/community/community-member.entity';
import { CommunityRole } from 'src/db/entities/community/community-role.entity';
import { Community } from 'src/db/entities/community/community.entity';
import { User } from 'src/db/entities/user/user.entity';
import { BaseEntity, Repository } from 'typeorm';
import { PatchCommunityDTO, PostCommunityDTO } from './dto/community.dto';
import { FileManagerService, IOptions } from 'src/file-manager/file-manager.service'

@Injectable()
export class CommunityService {
    constructor(
        @InjectRepository(Community)
        private readonly communityRepository: Repository<Community>,
        @InjectRepository(CommunityRole)
        private readonly communityRoleRepository: Repository<CommunityRole>,
        private readonly fileService: FileManagerService
    ) {}
    
    /**
     * Fetch a community by their slug
     * @throws NotFoundException
     * @param slug The slug of the community
     * @returns The requested community: Creator & Avatar, all roles, image, #members
     */
    async fetch(slug: string): Promise<Community> {
        try {
            let community = await this.communityRepository.createQueryBuilder('community')
                .innerJoinAndSelect('community.creator', 'user')
                .innerJoinAndSelect('user.avatar', 'avatar')
                .innerJoinAndSelect('community.roles', 'role')
                .innerJoinAndSelect('community.image', 'file')
                // .innerJoinAndSelect('community.defaultRole', 'role')
                .loadRelationCountAndMap('community.members', 'community.members')
                // .addSelect('community.roleOrder')
                .where('community.slug = :slug', {slug})
                .getOneOrFail()
            let rolesSorted: CommunityRole[] = []
            community.roles.forEach(role => {
                let key = community.roleOrder.indexOf(role.id)
                rolesSorted[key] = role
            })
            community.roles = rolesSorted

            return community
        } catch (e) {
            throw new NotFoundException(['Community was not found.'])
        }
    }

    /**
     * Fetch multiple communities with pagination
     * @param options 
     * @returns The requested community: Creator & Avatar, Image, #members
     */
    async fetchMany(options: { take: number, skip: number }): Promise<[Community[], number]> {
        try {
            let query = await this.communityRepository.createQueryBuilder('community')
                .innerJoinAndSelect('community.creator', 'user')
                .loadRelationCountAndMap('community.members', 'community.members')
                .innerJoinAndSelect('community.image', 'file')
                .take(options.take)
                .skip(options.skip)
                .getManyAndCount()
            return query
        } catch (e) {
            throw new BadGatewayException(['Unexpected error.'])
        }
    }

    /**
     * Update a community.
     * @param slug The slug of the community
     * @param data Payload for upading
     */
    async patch(community: Community, data: PatchCommunityDTO, member: CommunityMember): Promise<Community> {
        let payload = {...data, private: (member.user.id === community.creator.id) ? data.private: community.private}
        payload.private = (payload.private === undefined) ? community.private : payload.private


        try {
            // Dunno why I have to do it like this.
            // Was getting TypeError with builtin community.save(), .forEach() related entities
            // Saving it manually is better, though might need further investigation in the future.
            return this.communityRepository.save({
                slug: community.slug,
                ...payload
            })
        } catch (e) {
            throw new BadGatewayException(['Unexpected error. If this error persists, please contact a staff member.'])
        }
    }

    /**
     * Create a new community
     * 
     * @author In order to avoid circular dependencies, insert into table manually. Technically inefficient, but works with TypeORM
     * @todo implement created groups check
     * @param data The payload
     * @param creator The user creating it
     * @returns The new community
     */
    async create(data: PostCommunityDTO, creator: User, _file: Express.Multer.File, fileOptions: IOptions): Promise<Community> {
        // Create and define the community
        let community = new Community()
        community.slug = data.slug
        community.private = data.private
        community.creator = creator

        community.title = data.title
        community.description = data.description

        await community.save()

        // Create the role
        let memberRoleId = (await this.communityRepository.createQueryBuilder()
            .insert().into(CommunityRole)
            .values({
                name: 'Member',
                community
            }).execute()).generatedMaps[0].id
        
        let memberRole = await this.communityRoleRepository.findOne(memberRoleId)
        
        // Make the creator join the community
        await this.communityRepository.createQueryBuilder()
            .insert()
            .into(CommunityMember)
            .values({
                user: creator,
                role: memberRole,
                community,
                approved: true
            })
            .execute()
        
        let file = await this.fileService.upload(_file, creator, fileOptions)
        
        community.image = file
        community.roleOrder = [memberRoleId]
        community.defaultRole = memberRole
        

        // Save the community.
        return await community.save()
    }
}
