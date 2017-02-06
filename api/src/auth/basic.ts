import {BasicStrategy} from 'passport-http';


async function verify(username, password) {
  return false;
}

export const strategy = new BasicStrategy((username, password, done) => {
  verify(username, password)
  .then((user) => done(null, user))
  .catch((err) => done(err));
});
