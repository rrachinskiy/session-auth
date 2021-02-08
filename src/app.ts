import bodyparser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { COOKIE_NAME, PORT, __prod__ } from './constants';
import { errorHandler, notFoundException } from './middlewares';
import { authRouter, registerRouter } from './routes/auth';
import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';

const main = async () => {
  // Load env variables from .env if not production
  !__prod__ && (await import('dotenv')).config();

  const app = express();

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

  mongoose.connect(
    __prod__ ? `production mongodb link` : `mongodb://localhost:27017/${process.env.DB_NAME}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
  );

  app.use(notFoundException);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log('API server listening port:', PORT);
  });
};

main().catch(err => console.error(err));
