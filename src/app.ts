import bodyparser from 'body-parser';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import morgan from 'morgan';
import { createConnection } from 'typeorm';
import { COOKIE_NAME, PORT, __prod__ } from './constants';
import { User } from './entities/User';
import { errorHandler, notFoundException } from './middlewares';
import { authRouter, registerRouter, meRouter } from './routes/auth';

const main = async () => {
  // Load env variables from .env if not production
  !__prod__ && (await import('dotenv')).config();

  await createConnection({
    type: 'postgres',
    database: process.env.PSQL_DB,
    username: process.env.PSQL_USER,
    password: process.env.PSQL_PASSWORD,
    logging: !__prod__,
    synchronize: true,
    entities: [User],
  });

  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    }),
  );

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 120,
        httpOnly: true,
        sameSite: 'lax',
        secure: __prod__,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET as string,
      resave: false,
    }),
  );

  app.use(morgan('dev'));
  app.use(bodyparser.json());

  app.use(authRouter);
  app.use(registerRouter);
  app.use(meRouter);

  app.use(notFoundException);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log('API server listening port:', PORT);
  });
};

main().catch(err => console.error(err));
