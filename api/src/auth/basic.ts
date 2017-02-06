import {BasicStrategy} from 'passport-http';

import {User, UserModel} from '../models/user';


async function verify(req, username, password, done) {
  const user = await req.loaders.usersByEmail.load(username);

  if (user && user.testPassword(password)) {
    done(null, user);
  } else {
    done(null, false);
  }
}

export const strategy = new BasicStrategy(
  {passReqToCallback: true},
  // passport-http.d.ts doesn't allow BasicVerifyFunctionWithRequest
  // to be passed to BasicStrategy for some reason
  <any>verify,
);
