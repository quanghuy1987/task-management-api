import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableUser1742473002581 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '60',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
            length: '60',
          },
          {
            name: 'password',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'isActive',
            type: 'int',
            width: 2,
            default: 1,
          },
          {
            name: 'emailVerifiedAt',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            default: 'now()',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
