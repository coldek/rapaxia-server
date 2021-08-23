import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Config } from 'src/config';
import { Avatar } from 'src/db/entities/user/avatar.entity';
import { InventoryItem } from 'src/db/entities/shop/inventory-item.entity';
import { Item } from 'src/db/entities/shop/item.entity';
import { User } from 'src/db/entities/user/user.entity';
import { UsersService } from 'src/users/users.service';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User, Avatar, Item, InventoryItem]), PassportModule, ConfigModule,
  JwtModule.register({
    secret: Config.secretKey,
    signOptions: {}
  })],
  controllers: [AccountController],
  providers: [AccountService, UsersService, LocalStrategy, JwtStrategy],
  exports: [AccountService]
})
export class AccountModule {
  
}
