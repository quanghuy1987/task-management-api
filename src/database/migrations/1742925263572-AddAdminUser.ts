import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdminUser1742925263572 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Password: 123456
    await queryRunner.query(
      `INSERT INTO users (id, name, email, password, refreshToken, role, emailVerifiedAt, createdAt, updatedAt) VALUES (1, 'Admin', 'admin@gmail.com', '$2b$10$NWo.w7PMAJy5tqZSXNLkg.ZK2f5LfBfXTyiZGceSjJSQ5fO4540OK', 'ffd6ab42-5966-4422-9c9a-d2f77fd3f5a7', 'admin' , NOW(), NOW(), NOW())`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM 'users' WHERE ('id' = '1')`);
  }
}
