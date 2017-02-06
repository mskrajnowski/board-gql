import * as DataLoader from 'dataloader'

import {ILoaders} from './loaders'
import {User} from '../models/user'

export interface IContextLoaders extends ILoaders {
  usersById: DataLoader<number, User>,
  usersByEmail: DataLoader<string, User>,
}

export interface IContext {
  user: User,
  loaders: IContextLoaders,
}
