import * as sql from 'sequelize'

import {Board, BoardModel} from '../models/board'
import {State, StateModel} from '../models/state'

export default {
  Board: {
    states: (board: Board) => StateModel.findAll({
      where: {boardId: board.id},
      order: ['index'],
    }),
    state: (board: Board, {id}) => StateModel.findOne({
      where: {id: id, boardId: board.id},
    })
  },

  Mutation: {
    createState: async (obj, {boardId, state}) => {
      const board = await BoardModel.findById(boardId);

      if (!board) {
        throw new Error('Board not found');
      }

      const maxIndex = await StateModel.max('index', {where: {boardId}});
      const index = isNaN(maxIndex) ? 0 : maxIndex + 1;

      return await StateModel.create({
        boardId: boardId,
        index: index,
        ...state,
      });
    },
    removeState: async (obj, {id}) => {
      const state = await StateModel.findById(id);

      if (!state) {
        throw new Error('State not found');
      }

      const board = await state.getBoard();
      state.destroy();
      return board;
    },
  },
};
