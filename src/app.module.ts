import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { UsersModule } from './users/users.module';
import { AccountModule } from './account/account.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AvatarModule } from './avatar/avatar.module';
import { ShopModule } from './shop/shop.module';
import { DbModule } from './db/db.module';
import { ForumModule } from './forum/forum.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './account/strategies/roles.guard';

@Module({
  imports: [TypeOrmModule.forRoot(), UsersModule, AccountModule,
    ThrottlerModule.forRoot({
      ttl: 5,
      limit: 20
  }), ServeStaticModule.forRoot({
    rootPath: `${__dirname}/../../public/avatars`,
    serveRoot: `/images`
  }), AvatarModule, ShopModule, DbModule, ForumModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
