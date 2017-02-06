import * as _ from 'lodash';

import auth from './auth';
import user from './user';

export const resolvers = _.merge(
  auth,
  user,
);
