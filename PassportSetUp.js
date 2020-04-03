const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const cfg = require('config');
const redis = require('redis');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const client = redis.createClient();
const RedisWorker = require('./store/RedisWorker');
const redisWorker = new RedisWorker(client);

//Pass first parameter object as username and password custom names: email, password.
passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        session: false
    }, async (email, password, done) => {
        try {
            if(await redisWorker.verifyUser(email, password))
                return await done(false, {email, password});
            else
                return await done(new Error(`Incorrect login or password!`), false);
        }
        catch(error){
            console.log(`Error while verifying user in RedisWorker.verifyUser ${error}`);
            done(error);
        }
    }
));

//JWT Strategy

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: cfg.jwt.secret,
    ignoreExpiration: false,
    jsonWebTokenOptions: {
        clockTolerance: 3,
        maxAge: "1m", ///TODO Change this test time
    },
    algorithms: cfg.jwt.algorithms,
};

passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
        return done(null, payload.email);
}));

module.exports = passport;
