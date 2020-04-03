'use strict';
const { promisify } = require("util");

const HashFabric = require('../utils/HashFabric');

class RedisWorker{
    constructor(client) {
        this._client = client;
    }

    async setUser(username, pass){
        if(!username || !pass)
            throw new Error(`You should pass password and username!`);

        const asyncSet = promisify(this._client.set).bind(this._client);
        const userObj = {};
        try {
            userObj.authData = await this._createAuthObject(pass);
            await asyncSet(username, JSON.stringify(userObj));
            console.log(`Set user object for ${username}`);
        }
            //Throw up through the stack frame
        catch(err){
            throw err;
        }
    }

    async verifyUser(username, password){
        //TODO customize for agility structures
        //TODO incapsulate promisification into a private function
        const asyncCheck = promisify(this._client.get).bind(this._client);
        try {
            const userObj = JSON.parse((await asyncCheck(username) || '{}'));
            if(!userObj.authData)
                throw new Error(`Incorrect login or password!`);

            console.log(`Extracted non-empty userObject for ${username}`);
            //Testing sample
            return await this._isCorrectAuthData(password, userObj);
        }
        //Throw up through the stack frame
        catch(err){
            //TODO Add Exception types and if it's exception above we'll show it, if it's Redis or smth we'll throw up
            throw err;
        }
    }

    //Check for user existence in the Redis db
    async hasUser(username){
        const asyncCheck = promisify(this._client.get).bind(this._client);
            const userObj = JSON.parse((await asyncCheck(username) || '{}'));

            return Boolean(userObj.authData);
    }

    async _isCorrectAuthData(password, obj){
        const hash = new HashFabric(password, obj.authData.salt, obj.authData.iterations, obj.authData.keylen, obj.authData.algorithm).getHashSync();
        return hash === obj.authData.hash;
    }

    async _createAuthObject(password){
        const hashStore = new HashFabric(password);
        const authObject = hashStore.getOptions();
        delete authObject.string;
        authObject.hash = hashStore.getHashSync();

        return authObject;
    }
}

module.exports = RedisWorker;
