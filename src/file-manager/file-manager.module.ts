import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from 'src/db/entities/file.entity';
import { FileManagerService } from './file-manager.service';
import { FileManagerController } from './file-manager.controller';

@Module({
imports: [TypeOrmModule.forFeature([File])],
providers: [FileManagerService],
controllers: [FileManagerController],
exports: [FileManagerService]
})
export class FileManagerModule {}
