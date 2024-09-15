import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserCreateRelationship1726395098395 implements MigrationInterface {
    name = 'CreateUserCreateRelationship1726395098395'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_entity" ("user_id" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "phone_number" character varying, "location" character varying, "avatar" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email"), CONSTRAINT "PK_02777d5180610e45ddbb9bd5429" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE INDEX "user_entity_updated_at_index" ON "user_entity" ("updated_at") `);
        await queryRunner.query(`CREATE TABLE "relationship_entity" ("id" SERIAL NOT NULL, "user_id" character varying(50) NOT NULL, "friend_id" character varying(50) NOT NULL, "relationship_type" character varying(50) NOT NULL DEFAULT 'follower', "is_followed" boolean NOT NULL DEFAULT true, "follow_count" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ddc095ced421a1a20ac85b2778d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "relationship_entity_updated_at_index" ON "relationship_entity" ("updated_at") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."relationship_entity_updated_at_index"`);
        await queryRunner.query(`DROP TABLE "relationship_entity"`);
        await queryRunner.query(`DROP INDEX "public"."user_entity_updated_at_index"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
    }

}
