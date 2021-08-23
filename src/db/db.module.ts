import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsUniqueConstraint } from './dto/is-unique.decorator';

@Module({
    imports: [TypeOrmModule.forRoot()],
    providers: [IsUniqueConstraint]
})
export class DbModule {}
