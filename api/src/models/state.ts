import * as sql from 'sequelize'

import db from './db'

import {Board, BoardModel} from './board'
import {User} from './user'


export interface StateCreateAttributes {
  boardId: number;
  index: number;
  title: string;
  description?: string;
}

export interface State extends
  sql.Instance<StateCreateAttributes>,
  StateCreateAttributes
{
  id: number;
  index: number;
  title: string;
  description: string;

  // board
  boardId: number;
  getBoard: sql.BelongsToGetAssociationMixin<Board>;
  setBoard: sql.BelongsToSetAssociationMixin<Board, number>;
  createBoard: sql.BelongsToCreateAssociationMixin<Board>;
}

export const StateModel = db.define<State, StateCreateAttributes>('State', {
  id: {
    type: sql.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  boardId: {
    type: sql.INTEGER,
    allowNull: false,
    unique: 'State_unique_boardId_index',
  },
  index: {
    type: sql.INTEGER,
    allowNull: false,
    unique: 'State_unique_boardId_index',
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
  indexes: [{
    fields: ['boardId', 'index'],
    unique: true,
  }],
  instanceMethods: {
    async isVisibleTo(this: State, user: User) {
      const board = await this.getBoard();
      return board.isVisibleTo(user);
    },
  },
});


// Board relationship
StateModel.belongsTo(BoardModel, {
  foreignKey: 'boardId',
  onDelete: 'cascade',
});
BoardModel.hasMany(StateModel, {
  foreignKey: 'boardId',
});
