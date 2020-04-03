const HashFabric = require('../utils/HashFabric');
const crypto = require('crypto');


test('Check default settings', () => {
   const obj = new HashFabric('seregamw1', 'abc', 2, 32);
   const hash = obj.getHashSync();
   const opt = obj.getOptions();
   console.log(hash);
   expect(hash).toBe(crypto.pbkdf2Sync('seregamw1', opt.salt, opt.iterations,  Number.parseInt(opt.keylen), opt.algorithm).toString('hex'));
});

