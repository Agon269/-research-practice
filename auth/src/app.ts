import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import cookieSession from 'cookie-session';
import {currentuseRouter} from './routes/current-user';
import {signinRouter} from './routes/signin';
import {signupRouter} from './routes/signup';
import {signoutRouter} from './routes/signout';
import {errorHandler,NotFoundError} from '@buy.com/common';


const app = express();
app.set('trust proxy',true);
app.use(json());
app.use(cookieSession({
  signed:false,
  secure:process.env.NODE_ENV !== 'test'
}));

app.use(currentuseRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);


app.all('*', async (req, res) => {
  throw new NotFoundError("Page not found");
});

app.use(errorHandler);

export {app};