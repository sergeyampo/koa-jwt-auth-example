const passport = require('../PassportSetUp');
const cfg = require('config');
const jwt = require('jsonwebtoken');
const redis = require('redis');
const fs = require('fs');
const path = require('path');

//Check post body for credentials for authentication through the Redis
async function authPost(ctx, next) {
    //TODO add type of error
    await passport.authenticate('local', {session: false}, async (error, user, info) => {
        if (error)
            ctx.badRequest({error: error.message || info.message});
        else {
            try {
                ctx.state.user = user;
                ctx.state.actionType = 'login';
                return await next();
                //TODO add standardized successful message
            } catch (err) {
                console.log(err);
                ctx.internalServerError({message: 'Server cannot handle this request!'});
            }
        }
    })(ctx, next);
}

//Setting JWT token placing data from ctx.state.user put in previous middleware
async function setJWT(ctx, next){
    if(!ctx.state.user.email) {
        throw new Error('ctx.state.user.email is empty you should set it!');
    }

    const payload = {
        email: ctx.state.user.email
    };

    const options = {
        algorithm: cfg.jwt.algorithms[1],
        expiresIn: '1m',
    };

    const privateKey = fs.readFileSync(path.join(__dirname, '../', 'keys', 'ec_private.pem'));

    ctx.state.jwt = jwt.sign(payload, privateKey, options);

    return await next();
}

//Respond about success corresponding of the type of previous action
async function respondSuccessAuth(ctx){
    if(!ctx.state.user.email || !ctx.state.jwt)
        throw new Error('ctx.state.user.email is empty you should set it!');

    ctx.ok({ message: `Successfull ${ctx.state.actionType}`, token: ctx.state.jwt });
}

//Check Authorization header for a valid JWT
async function authJWT(ctx, next){
    await passport.authenticate('jwt', async (err, email, info) => {
        if(err || info)
            return ctx.unauthorized({ error: err || info.message });
        if(!email)
         throw new Error('email is empty!');

       ctx.state.user = email;
       return await next();

    })(ctx, next);
}

const client = redis.createClient();
const RedisWorker = require('../store/RedisWorker');
const redisWorker = new RedisWorker(client);

//Check credentials and add user to redis
async function registerPost(ctx, next){
    if(!ctx.request.body.email || !ctx.request.body.password)
        return ctx.badRequest({ message: `Incorrect credentials!` });

    try {
        if (!await redisWorker.hasUser(ctx.request.body.email))
            await redisWorker.setUser(ctx.request.body.email, ctx.request.body.password);
        else
            return ctx.badRequest({message: `${ctx.request.body.email} is already exist!`});
    }
    catch(err){
        console.log(err);
        return ctx.internalServerError({ message: 'The server cannot handle this request!'});
    }

    ctx.state.user = { email: ctx.request.body.email };
    ctx.state.actionType = 'registration';
    await next();
}

module.exports.setJWT = setJWT;
module.exports.authPost = authPost;
module.exports.respondSuccessAuth = respondSuccessAuth;
module.exports.authJWT = authJWT;
module.exports.registerPost = registerPost;
