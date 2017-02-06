import {BasicStrategy} from 'passport-http';

import {User, UserModel} from '../models/user';


async function verify(username, password) {
  const user = await UserModel.findOne({where: {email: username}});
  return user && user.testPassword(password) ? user : false;
}

export const strategy = new BasicStrategy((username, password, done) => {
  verify(username, password)
  .then((user) => done(null, user))
  .catch((err) => done(err));
});
