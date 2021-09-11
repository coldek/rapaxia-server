import { Controller, Param, Put, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { fromArrayLike } from 'rxjs/internal/observable/from';
import { RolesGuard } from 'src/account/strategies/roles.guard';
import { Role } from 'src/db/entities/user/user.entity';
import { FileManagerService } from './file-manager.service';

@Controller('file')
export class FileManagerController {
    constructor(
        private readonly fileManagerService: FileManagerService
    ) {}

    @Put('/:id')
    @SetMetadata('role', Role.Mod)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async update(@Param('id') id: number) {
        let file = await this.fileManagerService.getFile(id)
        return await file.verify()
        // return file
    }
}
