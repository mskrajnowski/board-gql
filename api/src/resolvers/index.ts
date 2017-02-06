import * as _ from 'lodash'

import auth from './auth'
import user from './user'
import board from './board'
import state from './state'
import task from './task'

import {loaderFactories as userLoaders} from './user'

import {createLoadersMiddleware, ILoaderFactories} from './loaders'

export const resolvers = _.merge(
  auth,
  board,
  state,
  task,
  user,
);

export const loaderFactories = <ILoaderFactories> _.merge(
  userLoaders,
);

export const loadersMiddleware = createLoadersMiddleware(loaderFactories);
