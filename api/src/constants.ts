import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot({
  isGlobal: true,
});

export const jwtConstants = {
  secret: process.env.JWT_SECRET_KEY,
};
export const USER_ROLE = 'user';
export const ADMIN_ROLE = 'admin';
export const IS_PUBLIC_KEY = 'isPublic';
export const ROLES_KEY = 'roles';
