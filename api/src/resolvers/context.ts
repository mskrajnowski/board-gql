import {ILoaders} from './loaders'
import {User} from '../models/user'

export interface IContext {
  user: User,
  loaders: ILoaders,
}
