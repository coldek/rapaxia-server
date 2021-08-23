import {MigrationInterface, QueryRunner} from "typeorm";

export class role1629726183483 implements MigrationInterface {
    name = 'role1629726183483'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`user\` ADD \`role\` enum ('0', '1', '2', '3', '4', '5') NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`avatar\` DROP COLUMN \`colors\``);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`avatar\` ADD \`colors\` json NOT NULL DEFAULT '{"head":"adaca6","torso":"93cfc9","left_arm":"adaca6","right_arm":"adaca6","left_leg":"adaca6","right_leg":"adaca6"}'`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`avatar\` DROP COLUMN \`apparel\``);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`avatar\` ADD \`apparel\` json NOT NULL DEFAULT '{"hats":[null,null,null],"accessories":[null,null],"shirt":null,"tshirt":null,"pants":null}'`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`item\` DROP FOREIGN KEY \`FK_04548d2604521d54d9ac383df0c\``);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`item\` CHANGE \`authorId\` \`authorId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`inventory_item\` DROP FOREIGN KEY \`FK_76c3dd2c365117171d3b25b772d\``);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`inventory_item\` DROP FOREIGN KEY \`FK_21f08891af6b1afb9be05f27e3a\``);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`inventory_item\` CHANGE \`userId\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`inventory_item\` CHANGE \`itemId\` \`itemId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`user\` DROP FOREIGN KEY \`FK_58f5c71eaab331645112cf8cfa5\``);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`user\` CHANGE \`email\` \`email\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`user\` CHANGE \`token\` \`token\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`user\` CHANGE \`avatarId\` \`avatarId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`comment\` DROP FOREIGN KEY \`FK_276779da446413a0d79598d4fbd\``);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`comment\` CHANGE \`authorId\` \`authorId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`user\` CHANGE \`email\` \`email\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`user\` CHANGE \`token\` \`token\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`user\` CHANGE \`avatarId\` \`avatarId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`comment\` CHANGE \`authorId\` \`authorId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`comment\` CHANGE \`authorId\` \`authorId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`forum_thread\` DROP FOREIGN KEY \`FK_cbf9d7876a8becddeca6135391a\``);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`forum_thread\` DROP FOREIGN KEY \`FK_e52dbe4056c19c1482fc051f014\``);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`forum_thread\` CHANGE \`topicId\` \`topicId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`forum_thread\` CHANGE \`authorId\` \`authorId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`forum_reply\` DROP FOREIGN KEY \`FK_15a5db02c0042c3952645b79457\``);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`forum_reply\` CHANGE \`threadId\` \`threadId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`item\` CHANGE \`authorId\` \`authorId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`inventory_item\` CHANGE \`userId\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`inventory_item\` CHANGE \`itemId\` \`itemId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`item\` ADD CONSTRAINT \`FK_04548d2604521d54d9ac383df0c\` FOREIGN KEY (\`authorId\`) REFERENCES \`rapaxia\`.\`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`inventory_item\` ADD CONSTRAINT \`FK_76c3dd2c365117171d3b25b772d\` FOREIGN KEY (\`userId\`) REFERENCES \`rapaxia\`.\`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`inventory_item\` ADD CONSTRAINT \`FK_21f08891af6b1afb9be05f27e3a\` FOREIGN KEY (\`itemId\`) REFERENCES \`rapaxia\`.\`item\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`user\` ADD CONSTRAINT \`FK_58f5c71eaab331645112cf8cfa5\` FOREIGN KEY (\`avatarId\`) REFERENCES \`rapaxia\`.\`avatar\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`comment\` ADD CONSTRAINT \`FK_276779da446413a0d79598d4fbd\` FOREIGN KEY (\`authorId\`) REFERENCES \`rapaxia\`.\`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`forum_thread\` ADD CONSTRAINT \`FK_cbf9d7876a8becddeca6135391a\` FOREIGN KEY (\`topicId\`) REFERENCES \`rapaxia\`.\`forum_topic\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`forum_thread\` ADD CONSTRAINT \`FK_e52dbe4056c19c1482fc051f014\` FOREIGN KEY (\`authorId\`) REFERENCES \`rapaxia\`.\`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`forum_reply\` ADD CONSTRAINT \`FK_15a5db02c0042c3952645b79457\` FOREIGN KEY (\`threadId\`) REFERENCES \`rapaxia\`.\`forum_thread\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`forum_reply\` DROP FOREIGN KEY \`FK_15a5db02c0042c3952645b79457\``);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`forum_thread\` DROP FOREIGN KEY \`FK_e52dbe4056c19c1482fc051f014\``);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`forum_thread\` DROP FOREIGN KEY \`FK_cbf9d7876a8becddeca6135391a\``);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`comment\` DROP FOREIGN KEY \`FK_276779da446413a0d79598d4fbd\``);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`user\` DROP FOREIGN KEY \`FK_58f5c71eaab331645112cf8cfa5\``);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`inventory_item\` DROP FOREIGN KEY \`FK_21f08891af6b1afb9be05f27e3a\``);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`inventory_item\` DROP FOREIGN KEY \`FK_76c3dd2c365117171d3b25b772d\``);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`item\` DROP FOREIGN KEY \`FK_04548d2604521d54d9ac383df0c\``);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`inventory_item\` CHANGE \`itemId\` \`itemId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`inventory_item\` CHANGE \`userId\` \`userId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`item\` CHANGE \`authorId\` \`authorId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`forum_reply\` CHANGE \`threadId\` \`threadId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`forum_reply\` ADD CONSTRAINT \`FK_15a5db02c0042c3952645b79457\` FOREIGN KEY (\`threadId\`) REFERENCES \`rapaxia\`.\`forum_thread\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`forum_thread\` CHANGE \`authorId\` \`authorId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`forum_thread\` CHANGE \`topicId\` \`topicId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`forum_thread\` ADD CONSTRAINT \`FK_e52dbe4056c19c1482fc051f014\` FOREIGN KEY (\`authorId\`) REFERENCES \`rapaxia\`.\`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`forum_thread\` ADD CONSTRAINT \`FK_cbf9d7876a8becddeca6135391a\` FOREIGN KEY (\`topicId\`) REFERENCES \`rapaxia\`.\`forum_topic\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`comment\` CHANGE \`authorId\` \`authorId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`comment\` CHANGE \`authorId\` \`authorId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`user\` CHANGE \`avatarId\` \`avatarId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`user\` CHANGE \`token\` \`token\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`user\` CHANGE \`email\` \`email\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`comment\` CHANGE \`authorId\` \`authorId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`comment\` ADD CONSTRAINT \`FK_276779da446413a0d79598d4fbd\` FOREIGN KEY (\`authorId\`) REFERENCES \`rapaxia\`.\`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`user\` CHANGE \`avatarId\` \`avatarId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`user\` CHANGE \`token\` \`token\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`user\` CHANGE \`email\` \`email\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`user\` ADD CONSTRAINT \`FK_58f5c71eaab331645112cf8cfa5\` FOREIGN KEY (\`avatarId\`) REFERENCES \`rapaxia\`.\`avatar\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`inventory_item\` CHANGE \`itemId\` \`itemId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`inventory_item\` CHANGE \`userId\` \`userId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`inventory_item\` ADD CONSTRAINT \`FK_21f08891af6b1afb9be05f27e3a\` FOREIGN KEY (\`itemId\`) REFERENCES \`rapaxia\`.\`item\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`inventory_item\` ADD CONSTRAINT \`FK_76c3dd2c365117171d3b25b772d\` FOREIGN KEY (\`userId\`) REFERENCES \`rapaxia\`.\`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`item\` CHANGE \`authorId\` \`authorId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`item\` ADD CONSTRAINT \`FK_04548d2604521d54d9ac383df0c\` FOREIGN KEY (\`authorId\`) REFERENCES \`rapaxia\`.\`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`avatar\` DROP COLUMN \`apparel\``);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`avatar\` ADD \`apparel\` longtext COLLATE "utf8mb4_bin" NOT NULL DEFAULT ''{"hats":[null,null,null],"accessories":[null,null],"shirt":null,"tshirt":null,"pants":null}''`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`avatar\` DROP COLUMN \`colors\``);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`avatar\` ADD \`colors\` longtext COLLATE "utf8mb4_bin" NOT NULL DEFAULT ''{"head":"adaca6","torso":"93cfc9","left_arm":"adaca6","right_arm":"adaca6","left_leg":"adaca6","right_leg":"adaca6"}''`);
        await queryRunner.query(`ALTER TABLE \`rapaxia\`.\`user\` DROP COLUMN \`role\``);
    }

}
