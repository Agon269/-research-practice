import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import cookieSession from 'cookie-session';
import {errorHandler,NotFoundError,currentUser} from '@buy.com/common';

import {createProductRouter} from "./routes/new";
import {showProduct} from "./routes/show";
import {indexProductRouter} from "./routes/index";
import {updateProductRouter} from "./routes/update";

const app = express();
app.set('trust proxy',true);
app.use(json());
app.use(cookieSession({
  signed:false,
  secure:process.env.NODE_ENV !== 'test'
}));

app.use(currentUser);
app.use(createProductRouter);
app.use(showProduct);
app.use(indexProductRouter);
app.use(updateProductRouter);


app.all('*', async (req, res) => {
  throw new NotFoundError("Page not found");
});

app.use(errorHandler);

export {app};