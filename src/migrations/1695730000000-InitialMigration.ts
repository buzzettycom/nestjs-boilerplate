import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1695730000000 implements MigrationInterface {
  name = 'InitialMigration1695730000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying(255) NOT NULL,
        "name" character varying(255),
        "password" character varying(255),
        "profile" jsonb,
        "is_active" boolean NOT NULL DEFAULT true,
        "is_admin" boolean NOT NULL DEFAULT false,
        "last_login_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);

    // Create index on email
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_users_email" ON "users" ("email")
    `);

    // Create contacts table
    await queryRunner.query(`
      CREATE TABLE "contacts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying(255) NOT NULL,
        "name" character varying(255),
        "subject" character varying(255),
        "message" text NOT NULL,
        "status" character varying(50) NOT NULL DEFAULT 'pending',
        "response" text,
        "responded_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_contacts_id" PRIMARY KEY ("id")
      )
    `);

    // Create settings table
    await queryRunner.query(`
      CREATE TABLE "settings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "key" character varying(255) NOT NULL,
        "value" jsonb NOT NULL,
        "description" character varying(255),
        "is_public" boolean NOT NULL DEFAULT false,
        "data_type" character varying(100) NOT NULL DEFAULT 'string',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_settings_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_settings_key" UNIQUE ("key")
      )
    `);

    // Create index on key
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_settings_key" ON "settings" ("key")
    `);

    // Create admin_logs table
    await queryRunner.query(`
      CREATE TABLE "admin_logs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "admin_id" uuid NOT NULL,
        "action" character varying(100) NOT NULL,
        "resource" character varying(100) NOT NULL,
        "resource_id" character varying(255),
        "details" jsonb,
        "ip_address" character varying(45),
        "user_agent" character varying(500),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_admin_logs_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_admin_logs_admin_id" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Insert default admin user
    await queryRunner.query(`
      INSERT INTO "users" ("email", "name", "is_admin", "is_active")
      VALUES ('admin@example.com', 'System Administrator', true, true)
    `);

    // Insert default settings
    await queryRunner.query(`
      INSERT INTO "settings" ("key", "value", "description", "is_public", "data_type")
      VALUES 
        ('site_name', '"NestJS Boilerplate"', 'Website name', true, 'string'),
        ('maintenance_mode', 'false', 'Enable maintenance mode', false, 'boolean'),
        ('allow_registration', 'true', 'Allow user registration', false, 'boolean'),
        ('max_users', '1000', 'Maximum number of users', false, 'number'),
        ('contact_email', '"support@example.com"', 'Contact email address', true, 'string')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order due to foreign key constraints
    await queryRunner.query(`DROP TABLE "admin_logs"`);
    await queryRunner.query(`DROP TABLE "settings"`);
    await queryRunner.query(`DROP TABLE "contacts"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}