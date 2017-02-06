import db from './db';
import {UserModel} from './user';
import {BoardModel} from './board';
import {StateModel} from './state';

export const models = [
  UserModel,
  BoardModel,
  StateModel,
];
export default db;
