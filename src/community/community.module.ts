import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Community } from 'src/db/entities/community/community.entity';
import { MemberService } from './member/member.service';
import { MemberController } from './member/member.controller';
import { CommunityMember } from 'src/db/entities/community/community-member.entity';
import { CommunityRole } from 'src/db/entities/community/community-role.entity';
import { FileManagerService } from 'src/file-manager/file-manager.service';
import { FileManagerModule } from 'src/file-manager/file-manager.module';
import { RoleController } from './role/role.controller';
import { RoleService } from './role/role.service';
import { PaginationMiddleware } from 'src/middleware/pagination.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Community, CommunityMember, CommunityRole]), FileManagerModule],
  providers: [CommunityService, MemberService, RoleService],
  controllers: [CommunityController, MemberController, RoleController]
})
export class CommunityModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PaginationMiddleware)
      .forRoutes(
        { path: 'community/role/:roleId/members', method: RequestMethod.GET },
        { path: 'community', method: RequestMethod.GET }
      )
  }
}
