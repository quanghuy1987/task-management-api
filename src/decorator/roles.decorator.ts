import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '@src/constants';
import { Role } from '@src/enum';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
