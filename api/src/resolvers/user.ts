import * as DataLoader from 'dataloader'

import {User, UserModel} from '../models/user'
import {collect, ILoaderFactories} from './loaders'
import {IContext} from './context'


export default {
  User: {
    hasPassword: (user: User) => !!user.passwordHash,

    boards: (user: User) => user.getBoards(),
    createdBoards: (user: User) => user.getCreatedBoards(),
  },

  Query: {
    users: async (obj, args, context: IContext) => primeAll(
      await UserModel.findAll(),
      context,
    ),
    user: async (obj, {id}, context: IContext) => primeOne(
      await context.loaders.usersById.load(id),
      context,
    )
  },

  Mutation: {
    inviteUser: async (obj, {input}, context: IContext) => primeOne(
      await UserModel.create(input),
      context,
    ),
  },
};

export type UserLoader = DataLoader<number, User>;

export const loaderFactories: ILoaderFactories = {
  usersById: () => new DataLoader(async (ids: number[]) => {
    const users = await UserModel.findAll({
      where: { id: { $in: ids } },
    });
    return collect(ids, users, (user) => user.id);
  }),
  usersByEmail: () => new DataLoader(async (ids: string[]) => {
    const users = await UserModel.findAll({
      where: { email: { $in: ids } },
    });
    return collect(ids, users, (user) => user.email);
  }),
};

export function primeOne(user: User, context: IContext) {
  context.loaders.usersById.prime(user.id, user);
  context.loaders.usersByEmail.prime(user.email, user);
  return user;
}

export function primeAll(users: User[], context: IContext) {
  users.forEach((user) => primeOne(user, context));
  return users;
}
