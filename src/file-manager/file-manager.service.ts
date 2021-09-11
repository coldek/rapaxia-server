import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from 'src/db/entities/file.entity';
import { Repository } from 'typeorm';
import { imageSize } from 'image-size'
import { Config } from 'src/config';
import fs = require('fs')
import crypto = require('crypto')
import { User } from 'src/db/entities/user/user.entity';

@Injectable()
export class FileManagerService {
    constructor(
        @InjectRepository(File)
        private readonly fileRepository: Repository<File>
    ) {}
    
    /**
     * Validates the file, then uploads it to location. When inserted upon database, it will be pending approval by a staff member.
     * @example let file = await this.fileManagerService.upload(_file, user, {
                type: 'image/png',
                dimensions: [2000,2000]
            })
     * @param file 
     * @param options 
     * @returns File
     */
    async upload(_file: Express.Multer.File | Array<Express.Multer.File>, user: User, options: {
        type: 'image/png' | 'model/obj',
        size?: number,
        destination?: string, // With respect to ./public
        dimensions?: [x: number, y: number]
    }): Promise<File> {
        // Default options
        let option = {...{
            size: 1e+6,
            desination: 'image\\',
        }, ...options}
        
        // VALIDATE THE IMAGE

        const buffer = _file['buffer']

        // Check file size
        if(_file['size'] > option.size) throw new BadRequestException([`File too large. max:${option.size}`])

        // Check file type
        if(_file['mimetype'] !== option.type) throw new BadRequestException([`Invalid file format. (${option.type})`])

        // If it is an image, check dimensions.
        if(_file['mimetype'] === 'image/png') {
            const {height, width, type} = imageSize(buffer)
            const [x,y] = option.dimensions
            if(width !== x || height !== y) throw new BadRequestException([`Invalid image dimensions. (${x}x${y})`])
        }

        const unique = crypto.randomBytes(20).toString('hex') 

        // Image validation complete, move file to destination folder.
        const destination = `${Config.directories.root}${Config.directories.imageServer}${option.desination}${unique}.${(_file['mimetype'].split('/')).slice(-1)}`
        
        let file = await this.fileRepository.save({
            src: unique,
            user
        })
        
        await fs.writeFileSync(destination, buffer.toString('base64'), 'base64')

        return file
    }

    async getFile(id: number): Promise<File> {
        try {
            return await this.fileRepository.findOneOrFail(id)
        } catch (e) {
            throw new NotFoundException(['File not found.'])
        }
    }
}
