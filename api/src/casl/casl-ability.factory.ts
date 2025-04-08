import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { ADMIN_ROLE } from '@src/constants';
import { Action } from '@src/enum';
import { Task } from '@src/task/task.entity';
import { User } from '@src/user/user.entity';

type Subjects = InferSubjects<typeof Task> | 'all';
type Actions = Action.Create | Action.Delete | Action.Read | Action.Update;
type AppAbility = MongoAbility<[Actions, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );

    if (user.role === ADMIN_ROLE) {
      can(Action.Create, 'all');
      can(Action.Read, 'all');
      can(Action.Update, 'all');
      can(Action.Delete, 'all');
    } else {
      can(Action.Read, Task, { userId: { $eq: user.id } });
      cannot(Action.Delete, 'all');
      cannot(Action.Update, 'all');
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
