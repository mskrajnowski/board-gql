import {Board} from '../models/board'
import {State, StateModel} from '../models/state'
import {Task, TaskModel} from '../models/task'

export default {
  Task: {
    board: (task: Task) => task.getBoard(),
    state: (task: Task) => task.getState(),
    creator: (task: Task) => task.getCreator(),
  },

  State: {
    tasks: (state: State) => TaskModel.findAll({
      where: {stateId: state.id},
      order: ['createdAt'],
    }),
    task: (state: State, {id}) => TaskModel.findOne({
      where: {
        id: id,
        stateId: state.id,
      },
    })
  },

  Board: {
    tasks: (board: Board) => TaskModel.findAll({
      where: {boardId: board.id},
      order: ['createdAt'],
    }),
    task: (board: Board, {id}) => TaskModel.findOne({
      where: {
        id: id,
        boardId: board.id,
      },
    }),
  },

  Mutation: {
    createTask: async (obj, {input}, context) => {
      if (!input.stateId) {
        const state = await StateModel.findOne({
          where: {boardId: input.boardId},
          order: ['index'],
        });
        input.stateId = state.id;
      }

      return TaskModel.create({
        creatorId: context.user.id,
        ...input
      });
    },
    removeTask: async (obj, {id}) => {
      const task = await TaskModel.findById(id);
      if (!task) {
        throw new Error('Task not found');
      }
      const board = await task.getBoard();
      await task.destroy();
      return board;
    },
    setTaskState: async (obj, {taskId, stateId}) => {
      const task = await TaskModel.findById(taskId);
      if (!task) {
        throw new Error('Task not found');
      }
      await task.setState(stateId);
      return task;
    },
  },
}
