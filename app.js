'use strict';

const path = require('path');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const cache = require('koa-static-cache');
const Helmet = require('koa-helmet');
const respond = require('koa-respond');

const app = new Koa();

app.use(Helmet());
app.use(cache(path.join(__dirname, 'public'), {
    cacheControl: 'must-revalidate'
}));
app.use(logger());
app.use(respond());
app.use(bodyParser({
    onerror: (err, ctx) => { ctx.badRequest({ message: "Incorrect format data!" }); ctx.state.error = err },
    jsonLimit: '500kb'
}));
//Error state checker
app.use(async (ctx, next) => {
    if(ctx.state.error)
        return;

    await next();
});

const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');

app.use(authRouter.routes());
app.use(indexRouter.routes());

app.listen(3000, () => console.log('The server is running on 3000 port!'));


