'use strict';

const crypto = require('crypto');
const cfg = require('config');

//TODO Make salt warning if it less than 16 bytes length

class HashFabric{
    constructor(string, salt, iterations, keylen, algorithm) {
        this._algo = algorithm  || cfg.hashing.algorithms[((min, max) => Math.ceil(Math.random() * (max - min) + min))(0, 2)];
        this._iterations = iterations || ((min, max) => Math.ceil(Math.random() * (max - min) + min))(1, 4);
        this._string = string;
        this._salt = salt || Math.random().toString(32).substr(4, 10);
        this._keylen = keylen || Number.parseInt(cfg.hashing.keylen);
    }

    /**
     *
     * @param callback {function(err, string)}
     * @returns {Promise<void>}
     */
    async getHash(callback){
            crypto.pbkdf2(this._string, this._salt, this._iterations, this._keylen, this._algo, (err, key) =>{
                if(err) return callback(err);
                callback(undefined, key.toString('hex'));
            });
    }

    /**
     *
     * @returns {string} hash string
     */
    getHashSync(){
        return crypto.pbkdf2Sync(this._string, this._salt, this._iterations, this._keylen, this._algo).toString('hex');
    }

    getOptions(){
        return {
            algorithm: this._algo,
            iterations: this._iterations,
            string: this._string,
            salt: this._salt,
            keylen: this._keylen,
        }
    }
}

module.exports = HashFabric;
