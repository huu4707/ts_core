import express from 'express';
import passport from 'passport';
import { json } from 'body-parser';
import cors from 'cors';
import { onError } from './middleware/on-error.middleware';
import { accountRouter, customerRouter  } from './ref';
import cookieParser from 'cookie-parser';
import session from 'express-session';

const app = express();
app.use(cookieParser()); //Parse cookie
app.use(cors());
app.use(json())

app.use(session({ secret: 'keyboard cat'}));  //Save user login
app.use(passport.initialize());
app.use(passport.session());

app.use(onError);
app.use('/public/account', accountRouter);
app.use('/customer', customerRouter);
app.use((req, res, next) => {
    setTimeout(() => {
        next();
    }, 100);
})

export { app };
