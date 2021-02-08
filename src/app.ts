import bodyparser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { PORT, __prod__ } from './constants';
import { errorHandler, notFoundException } from './middlewares';
import { authRouter, registerRouter } from './routes/auth';

const main = async () => {
  // Load env variables from .env if not production
  !__prod__ && (await import('dotenv')).config();

  const app = express();

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
