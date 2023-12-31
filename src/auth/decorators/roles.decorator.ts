import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { ROLE } from '../constant/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: ROLE[]): CustomDecorator<string> =>
  SetMetadata(ROLES_KEY, roles);
