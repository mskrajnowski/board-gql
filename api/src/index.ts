import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools'

import models from './models';
import {resolvers, loadersMiddleware} from './resolvers'
import {IRequest} from './resolvers/loaders'
import {generate, strategy as jwtStrategy} from './auth/jwt';
import {strategy as basicStrategy} from './auth/basic';
import {readSchema} from './schema'


const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;


async function main() {
  await models.sync();

  const typeDefs = await readSchema();
  const schema = makeExecutableSchema({typeDefs, resolvers});

  const app = express();

  passport.use(basicStrategy);
  passport.use(jwtStrategy);
  app.use(passport.initialize())

  app.get(
    '/auth',
    loadersMiddleware,
    passport.authenticate('basic', {session: false}),
    (req, res) => res.end(generate(req.user))
  )

  app.use(
    '/graphql',
    loadersMiddleware,
    passport.authenticate('jwt', {session: false}),
    bodyParser.json(),
    graphqlExpress((req: IRequest) => ({
      schema: schema,
      context: {
        user: req.user,
        loaders: req.loaders,
      },
    })),
  );

  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    passHeader: `'Authorization': 'JWT ' + (/token=([^&#]*)/.exec(location.search) || ['', ''])[1]`,
  }));

  app.listen(PORT);
}

main();
