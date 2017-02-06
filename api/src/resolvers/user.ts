import {User, UserModel} from '../models/user'


export default {
  User: {
    hasPassword: (user: User) => !!user.passwordHash,

    boards: (user: User) => user.getBoards(),
    createdBoards: (user: User) => user.getCreatedBoards(),
  },

  Query: {
    users: async (obj, args, context) => UserModel.findAll(),
    user: (obj, {id}, context) => UserModel.findById(id),
  },

  Mutation: {
    inviteUser: (obj, {input}) => UserModel.create(input),
  },
};
