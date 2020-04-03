module.exports = (router) => {
 /*   router.use('/public', require('./public'));
    router.use('/private', require('./private'));*/
    router.use('/auth', require('./auth'));
};
