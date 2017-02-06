import {Strategy, ExtractJwt, StrategyOptions} from 'passport-jwt';
import {sign, SignOptions} from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'secret';

const signOptions: SignOptions = {
  algorithm: 'HS256',
};

const strategyOptions: StrategyOptions = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  algorithms: [signOptions.algorithm],
};

export function generate(user: {id: number}) {
  const payload = {userId: user.id};
  return sign(payload, secret, signOptions);
}

async function verify(payload) {
  return false;
}

export const strategy = new Strategy(strategyOptions, (payload, done) => {
  verify(payload)
  .then((user) => done(null, user))
  .catch((err) => done(err));
});
