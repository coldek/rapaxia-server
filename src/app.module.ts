import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { UsersModule } from './users/users.module';
import { AccountModule } from './account/account.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AvatarModule } from './avatar/avatar.module';
import { ShopModule } from './shop/shop.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UsersModule, AccountModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10
  }), ServeStaticModule.forRoot({
    rootPath: `${__dirname}/../../public/avatars`,
    serveRoot: `/images`
  }), AvatarModule, ShopModule, DbModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
