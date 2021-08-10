import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { UsersModule } from './users/users.module';
import { AccountModule } from './account/account.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UsersModule, AccountModule,],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
