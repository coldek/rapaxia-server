import {MigrationInterface, QueryRunner} from "typeorm";

export class rapaxia1629638367378 implements MigrationInterface {
    name = 'rapaxia1629638367378'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`rapaxia\`.\`comment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`updated\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`text\` varchar(255) NOT NULL, \`authorId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`rapaxia\`.\`item\` (\`id\` int NOT NULL AUTO_INCREMENT, \`updated\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`identifier\` varchar(255) NOT NULL, \`price\` int NOT NULL, \`type\` enum ('face', 'shirt', 'pants', 'hat', 'accessory') NOT NULL, \`authorId\` int NULL, UNIQUE INDEX \`REL_04548d2604521d54d9ac383df0\` (\`authorId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`rapaxia\`.\`inventory_item\` (\`id\` int NOT NULL AUTO_INCREMENT, \`updated\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`equipped\` tinyint NOT NULL DEFAULT 0, \`userId\` int NULL, \`itemId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`rapaxia\`.\`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`updated\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`username\` varchar(255) NOT NULL, \`email\` varchar(255) NULL, \`password\` varchar(255) NOT NULL, \`token\` varchar(255) NULL, \`currency\` int NOT NULL DEFAULT '0', \`beta\` tinyint NOT NULL DEFAULT 0, \`avatarId\` int NULL, UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), UNIQUE INDEX \`IDX_a854e557b1b14814750c7c7b0c\` (\`token\`), UNIQUE INDEX \`REL_58f5c71eaab331645112cf8cfa\` (\`avatarId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`rapaxia\`.\`avatar\` (\`id\` int NOT NULL AUTO_INCREMENT, \`updated\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`colors\` json NOT NULL DEFAULT '{"head":"adaca6","torso":"93cfc9","left_arm":"adaca6","right_arm":"adaca6","left_leg":"adaca6","right_leg":"adaca6"}', \`apparel\` json NOT NULL DEFAULT '{"hats":[null,null,null],"accessories":[null,null],"shirt":null,"tshirt":null,"pants":null}', \`cache\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`comment\` ADD CONSTRAINT \`FK_276779da446413a0d79598d4fbd\` FOREIGN KEY (\`authorId\`) REFERENCES \`rapaxia\`.\`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`item\` ADD CONSTRAINT \`FK_04548d2604521d54d9ac383df0c\` FOREIGN KEY (\`authorId\`) REFERENCES \`rapaxia\`.\`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`inventory_item\` ADD CONSTRAINT \`FK_76c3dd2c365117171d3b25b772d\` FOREIGN KEY (\`userId\`) REFERENCES \`rapaxia\`.\`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`inventory_item\` ADD CONSTRAINT \`FK_21f08891af6b1afb9be05f27e3a\` FOREIGN KEY (\`itemId\`) REFERENCES \`rapaxia\`.\`item\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`user\` ADD CONSTRAINT \`FK_58f5c71eaab331645112cf8cfa5\` FOREIGN KEY (\`avatarId\`) REFERENCES \`rapaxia\`.\`avatar\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`user\` DROP FOREIGN KEY \`FK_58f5c71eaab331645112cf8cfa5\``);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`inventory_item\` DROP FOREIGN KEY \`FK_21f08891af6b1afb9be05f27e3a\``);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`inventory_item\` DROP FOREIGN KEY \`FK_76c3dd2c365117171d3b25b772d\``);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`item\` DROP FOREIGN KEY \`FK_04548d2604521d54d9ac383df0c\``);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`comment\` DROP FOREIGN KEY \`FK_276779da446413a0d79598d4fbd\``);
        await queryRunner.query(`DROP TABLE \`rapaxia\`.\`avatar\``);
        await queryRunner.query(`DROP INDEX \`REL_58f5c71eaab331645112cf8cfa\` ON \`rapaxia\`.\`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_a854e557b1b14814750c7c7b0c\` ON \`rapaxia\`.\`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`rapaxia\`.\`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`rapaxia\`.\`user\``);
        await queryRunner.query(`DROP TABLE \`rapaxia\`.\`user\``);
        await queryRunner.query(`DROP TABLE \`rapaxia\`.\`inventory_item\``);
        await queryRunner.query(`DROP INDEX \`REL_04548d2604521d54d9ac383df0\` ON \`rapaxia\`.\`item\``);
        await queryRunner.query(`DROP TABLE \`rapaxia\`.\`item\``);
        await queryRunner.query(`DROP TABLE \`rapaxia\`.\`comment\``);
    }

}
