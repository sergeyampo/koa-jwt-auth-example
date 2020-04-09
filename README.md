### Description
Koa boilerplate with REST API JWT koa-passport authentication and registration with caching static on specific routes.
### Authentication and registration
You can review a simple example of JWT stateless authentication built with: 
* [koa-passport](https://github.com/rkusa/koa-passport) 
* [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
* [passport-jwt](https://github.com/mikenicholson/passport-jwt)
* [passport-local](https://github.com/jaredhanson/passport-local)

Registration is implemented with Redis store([redis](https://github.com/NodeRedis/node-redis)) and hash functions with simple and high-perfomance crypto node library. We use pseudo-random choice of hashing algorithm, salt, iterations for each user to provide a little bit more security.
### Caching
A flexible example of caching static files is provided by: 
* [koa-send](https://github.com/koajs/send)
* [koa-conditional-get](https://github.com/koajs/conditional-get)
* [koa-etag](https://github.com/koajs/etag)

There is a cache policy on specific routes and middlewares so you can correctly use such logic in your SPA application or elsewhere you need API and a static serving in one place.
