import * as _ from 'lodash'

import auth from './auth'
import user from './user'
import board from './board'
import state from './state'
import task from './task'

export const resolvers = _.merge(
  auth,
  board,
  state,
  task,
  user,
);
