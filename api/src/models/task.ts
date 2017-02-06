import * as sql from 'sequelize'

import db from './db'
import {Board, BoardModel} from './board'
import {User, UserModel} from './user'
import {State, StateModel} from './state'


export interface TaskCreateAttributes {
  boardId: number;
  stateId: number;
  creatorId: number;

  title: string;
  description?: string;
}

export interface Task extends
  sql.Instance<TaskCreateAttributes>,
  TaskCreateAttributes
{
  description: string;

  // board
  getBoard: sql.BelongsToGetAssociationMixin<Board>;
  setBoard: sql.BelongsToSetAssociationMixin<Board, number>;
  createBoard: sql.BelongsToCreateAssociationMixin<Board>;

  // state
  getState: sql.BelongsToGetAssociationMixin<State>;
  setState: sql.BelongsToSetAssociationMixin<State, number>;
  createState: sql.BelongsToCreateAssociationMixin<State>;

  // creator
  getCreator: sql.BelongsToGetAssociationMixin<User>;
  setCreator: sql.BelongsToSetAssociationMixin<User, number>;
  createCreator: sql.BelongsToCreateAssociationMixin<User>;
}

export const TaskModel = db.define<Task, TaskCreateAttributes>('Task', {
  id: {
    type: sql.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: sql.STRING,
    defaultValue: '',
  },
  description: {
    type: sql.STRING,
    defaultValue: '',
  },
}, {
  instanceMethods: {
    async isVisibleTo(this: Task, user: User) {
      const board = await this.getBoard();
      return board.isVisibleTo(user);
    },
  },
});


// Board relationship
TaskModel.belongsTo(BoardModel, {
  as: 'board',
  foreignKey: {
    allowNull: false,
  },
  onDelete: 'cascade',
});
BoardModel.hasMany(TaskModel, {
  as: 'tasks',
  foreignKey: 'boardId',
});

// State relationship
TaskModel.belongsTo(StateModel, {
  as: 'state',
  foreignKey: {
    allowNull: false,
  },
  onDelete: 'cascade',
});
StateModel.hasMany(TaskModel, {
  as: 'tasks',
  foreignKey: 'stateId',
});

// Creator relationship
TaskModel.belongsTo(UserModel, {
  as: 'creator',
  foreignKey: {allowNull: false},
  onDelete: 'cascade',
})
UserModel.hasMany(TaskModel, {
  as: 'createdTasks',
  foreignKey: 'creatorId',
})
