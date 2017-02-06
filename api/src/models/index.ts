import db from './db';
import {UserModel} from './user';
import {BoardModel} from './board';

export const models = [UserModel, BoardModel];
export default db;
