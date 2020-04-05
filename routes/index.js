const Router = require('koa-router');
const serve = require('koa-send');
const etag = require('koa-etag');
const conditional = require('koa-conditional-get');
const path = require('path');

const router = new Router();

//Such conditions helps to use an API with static caching site.
//For example SPA sending cached index.
//We require just only serve specific folder for a specific middleware
// function which sends static.
//We ask server to handle Conditional Get requests and add ETag header to
//all responses for this route.
router.use(conditional());
router.use(etag());
router.get('/', async (ctx) => {
    await serve(ctx, '/', {
        root: path.join(__dirname, '../', 'public'),
        index: 'index.html',
    });
});

module.exports = router;
