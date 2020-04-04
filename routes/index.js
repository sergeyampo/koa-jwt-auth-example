const Router = require('koa-router');
const path = require('path');

const router = new Router();

router.get('/', async (ctx) => {
    ctx.redirect('/index.html');
});

module.exports = router;
