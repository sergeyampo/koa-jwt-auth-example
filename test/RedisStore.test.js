const redis = require('redis');
const RedisWorker = require('../store/RedisWorker');
const cfg = require('config');

test('Imitate register user and check auth parametres', async () => {
    const client = redis.createClient({
        host: cfg.redis.host,
        port: cfg.redis.port
    });
    const password = 'password';
    const worker = new RedisWorker(client);

    try {
        await worker.setUser('sergey', password);
        test.expect(await worker.verifyUser('sergey', password)).toBe(true);
    } catch (err) {
        console.log(err);
    }
});
