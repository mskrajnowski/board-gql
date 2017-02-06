import * as _ from 'lodash';

import auth from './auth';
import user from './user';
import board from './board';

export const resolvers = _.merge(
  auth,
  board,
  user,
);
