import db from './db'
import {UserModel} from './user'
import {BoardModel} from './board'
import {StateModel} from './state'
import {TaskModel} from './task'

export const models = [
  UserModel,
  BoardModel,
  StateModel,
  TaskModel,
];
export default db;
