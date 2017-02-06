import * as sql from 'sequelize';

import db from './db';
import {User, UserModel, UserCreateAttributes} from './user';
import {State, StateCreateAttributes} from './state';


export interface BoardCreateAttributes {
  creatorId: number;
  title: string;
  description?: string;
}


export interface BoardMemberCreateAttributes {}


export interface Board extends
  sql.Instance<BoardCreateAttributes>,
  BoardCreateAttributes
{
  id: number;
  title: string;
  description: string;

  isVisibleTo(user: User): boolean;

  // creator
  getCreator: sql.BelongsToGetAssociationMixin<User>;
  setCreator: sql.BelongsToSetAssociationMixin<User, number>;
  createCreator: sql.BelongsToCreateAssociationMixin<User>;

  // members
  getMembers: sql.BelongsToManyGetAssociationsMixin<User>;
  setMembers: sql.BelongsToManySetAssociationsMixin<User, number, BoardMemberCreateAttributes>;
  addMembers: sql.BelongsToManyAddAssociationsMixin<User, number, BoardMemberCreateAttributes>;
  hasMembers: sql.BelongsToManyHasAssociationsMixin<User, number>;

  addMember: sql.BelongsToManyAddAssociationMixin<User, number, BoardMemberCreateAttributes>;
  createMember: sql.BelongsToManyCreateAssociationMixin<UserCreateAttributes, BoardMemberCreateAttributes>;
  removeMember: sql.BelongsToManyRemoveAssociationMixin<User, number>;
  hasMember: sql.BelongsToManyHasAssociationMixin<User, number>;

  // states
  getStates: sql.HasManyGetAssociationsMixin<State>;
  setStates: sql.HasManySetAssociationsMixin<State, number>;
  addStates: sql.HasManyAddAssociationsMixin<State, number>;
  hasStates: sql.HasManyHasAssociationsMixin<State, number>;

  addState: sql.HasManyAddAssociationMixin<State, number>;
  createState: sql.HasManyCreateAssociationMixin<StateCreateAttributes>;
  removeState: sql.HasManyRemoveAssociationMixin<State, number>;
  hasState: sql.HasManyHasAssociationMixin<State, number>;
}

export const BoardModel = db.define<Board, BoardCreateAttributes>('Board', {
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
    isVisibleTo(this: Board, user: User) {
      return this.hasMember(user);
    },
  },
});


// Creator relationship
BoardModel.belongsTo(UserModel, {
  as: 'creator',
  foreignKey: {allowNull: false},
  onDelete: 'cascade',
});
UserModel.hasMany(BoardModel, {
  as: 'createdBoards',
  foreignKey: 'creatorId',
});


// Member relationship
UserModel.belongsToMany(BoardModel, {
  as: 'boards',
  through: 'BoardMembers',
  foreignKey: 'memberId',
});
BoardModel.belongsToMany(UserModel, {
  as: 'members',
  through: 'BoardMembers',
  foreignKey: 'boardId',
});
