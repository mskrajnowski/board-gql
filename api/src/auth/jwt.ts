import {Strategy, ExtractJwt, StrategyOptions} from 'passport-jwt';
import {sign, SignOptions} from 'jsonwebtoken';

import {User, UserModel} from '../models/user';

const secret = process.env.JWT_SECRET || 'secret';

const signOptions: SignOptions = {
  algorithm: 'HS256',
};

const strategyOptions: StrategyOptions = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  algorithms: [signOptions.algorithm],
  passReqToCallback: true,
};

export function generate(user: {id: number}) {
  const payload = {userId: user.id};
  return sign(payload, secret, signOptions);
}

async function verify(req, payload, done) {
  const user = await req.loaders.usersById.load(payload.userId);

  if (user) {
    done(null, user);
  } else {
    done(null, false);
  }
}

export const strategy = new Strategy(strategyOptions, verify);
