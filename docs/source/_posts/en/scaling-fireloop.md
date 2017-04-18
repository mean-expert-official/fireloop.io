---
title: Scaling FireLoop
lenguage: en
---

![FireLoop.io](https://storage.googleapis.com/mean-expert-images/fireloop-logo.png)

## Scaling FireLoop

Building apps with [FireLoop] is nice and easy, but that would be worthless if the platform wouldn't scale into multiple server or even process instances.

The following documentation will explain how to enable [FireLoop] to work under clustered environments.

## Requirements

- [SDK Builder] v2.1.0-rc.10+
- [LoopBack Component Real-Time] v1.0.0-rc.5+
- [Socket IO] Adapter *(Any valid socket.io-adapter like [socket.io-adapter-mongo], [socket.io-redis], etc)*
- PubSub capable database like [MongoDB] or [Redis]


## Creating DataSource
Regardless the datasource you select for your API Models, you will need to create a datasource pointing to a [MongoDB] or [Redis] database.

If you already selected [MongoDB] or [Redis] database for your API Models, you won't need to create a new datasource, users using any other databases like SQL ones, *will require to create a new datasource pointing to [MongoDB] or [Redis]* and install its [LoopBack] dependency.


````sh
$ cd to/project/api
$ npm install --save [loopback-connector-mongodb | loopback-connector-redis]
````

and configure as any other [LoopBack] datasource, example:

````json
{
  "mongodb": {
    "url": "mongodb://user:pass@host:27016/dbname",
    "name": "mongodb",
    "connector": "mongodb"
  }
}
````
`server/datasources.json`

## Enable Clustering Mode

In order to enable the clustering mode, we need to set the following configurations:

````json
{
  "@mean-expert/loopback-component-realtime": {
    "auth": true,
    "debug": false,
    "driver": {
      "name": "socket.io",
      "options": {
        "adapter": {
          "name": "socket.io-adapter-mongo",
          "datasource": "mongodb"
        }
      }
    }
  }
}
````

Please note that the `adapter.name` should be the adapter you selected and installed prior this process, as well as the `adapter.datasource` should be the name of the datasource you created.

After following the configurations above, [FireLoop] will work either on clustered process or server environments.

[NodeJS]: http://nodejs.org
[Horizon]: http://horizon.io/
[FireLoop]: http://fireloop.io
[FireLoop.io]: http://fireloop.io
[FireBase]: https://firebase.google.com/
[Google's FireBase]: https://firebase.google.com/
[NativeScript 2]: http://nativescript.org
[Ionic 2]: http://ionic.io
[Angular 2]: http://angular.io
[LoopBack]: http://loopback.io
[IBM's LoopBack Framework]: http://loopback.io
[LoopBack SDK Builder]: http://github.com/mean-expert-official/loopback-sdk-builder
[loopback-sdk-angular]: http://npmjs.org/package/loopback-sdk-angular
[loopback-component-pubsub]: http://npmjs.org/package/loopback-component-pubsub
[LoopBack Component Real-Time]: http://github.com/mean-expert-official/loopback-component-realtime
[TypeScript]: https://www.typescriptlang.org
[SDK Builder]: https://github.com/mean-expert-official/loopback-sdk-builder
[Real-Time]: https://github.com/mean-expert-official/loopback-component-realtime
[Socket IO]: https://socket.io
[socket.io-adapter-mongo]: https://www.npmjs.com/package/socket.io-adapter-mongo
[socket.io-redis]: https://www.npmjs.com/package/socket.io-redis
[MongoDB]: https://www.mongodb.com/
[Redis]: https://redis.io/