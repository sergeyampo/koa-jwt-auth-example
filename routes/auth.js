const Router = require('koa-router');
const setJWT = require('../middleware/auth').setJWT;
const authPost = require('../middleware/auth').authPost;
const respondSuccessAuth = require('../middleware/auth').respondSuccessAuth;
const authJWT = require('../middleware/auth').authJWT;
const registerPost = require('../middleware/auth').registerPost;
const passport = require('../PassportSetUp');

const router = new Router();

router.use(passport.initialize());

router.post('/auth/login', authPost, setJWT, respondSuccessAuth);

router.get('/status', authJWT, async (ctx) => {
    ctx.ok({ message: `${ctx.state.user} logged in!` });
});

router.post('/auth/register', registerPost, setJWT, respondSuccessAuth);

module.exports = router;
