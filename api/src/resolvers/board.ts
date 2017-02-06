import {UserModel} from '../models/user'
import {Board, BoardModel} from '../models/board'

export default {
  Board: {
    creator: (board: Board) => board.getCreator(),
    members: (board: Board) => board.getMembers(),
  },

  Query: {
    boards: () => BoardModel.findAll(),
    board: (obj, {id}) => BoardModel.findById(id),
  },

  Mutation: {
    createBoard: async (obj, {input}, context) => {
      const board = await BoardModel.create({
        creatorId: context.user.id,
        ...input,
      });
      board.addMember(context.user);
      return board;
    },

    inviteBoardMember: async (obj, {boardId, invite}) => {
      const board = await BoardModel.findById(boardId);

      if (!board) {
        throw new Error(`Board with id ${boardId} not found`);
      }

      const [user] = await UserModel.findOrCreate({
        where: {email: invite.email},
        defaults: invite,
      });

      await board.addMember(user);

      return board;
    },
  },
};
