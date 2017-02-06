import * as DataLoader from 'dataloader'

import {UserModel} from '../models/user'
import {Board, BoardModel} from '../models/board'
import {IContext} from './context'
import {collect, ILoaderFactories} from './loaders'
import {
  primeOne as primeUser,
  primeAll as primeUsers
} from './user'


export default {
  Board: {
    creator: async (board: Board, args, context: IContext) => primeUser(
      await context.loaders.usersById.load(board.creatorId),
      context,
    ),
    members: async (board: Board, args, context: IContext) => primeUsers(
      await board.getMembers(),
      context,
    )
  },

  Query: {
    boards: () => BoardModel.findAll(),
    board: (obj, {id}) => BoardModel.findById(id),
  },

  Mutation: {
    createBoard: async (obj, {input}, context: IContext) => {
      const board = await BoardModel.create({
        creatorId: context.user.id,
        ...input,
      });
      board.addMember(context.user);
      return board;
    },

    inviteBoardMember: async (obj, {boardId, invite}, context: IContext) => {
      const board = await BoardModel.findById(boardId);

      if (!board) {
        throw new Error(`Board with id ${boardId} not found`);
      }

      const [user] = await UserModel.findOrCreate({
        where: {email: invite.email},
        defaults: invite,
      });

      primeUser(user, context);

      await board.addMember(user);

      return board;
    },
  },
};

export const loaders: ILoaderFactories = {
  boardMembers: () => new DataLoader<number, User>(async (ids: number[]) => {
    const users = await UserModel.findAll({
      include: [{
        model: BoardModel,
        as: 'boards',
        through: {attributes: ['boardId']},
        where: {id: {$in: ids}},
      }],
    });

    return collect(ids, users, (user) => user.boardId);
  }),
};
