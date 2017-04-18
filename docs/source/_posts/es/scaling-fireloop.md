---
title: Escalando FireLoop
lenguage: es
---
![FireLoop.io](https://storage.googleapis.com/mean-expert-images/fireloop-logo.png)

## Escalando FireLoop

Construir aplicaciones con [FireLoop] es agradable y fácil, pero no valdría nada si la plataforma no escalara a varios servidores o incluso procese instancias.

La siguiente documentación explicará cómo habilitar [FireLoop] para trabajar en entornos agrupados.

## Requerimientos

- [SDK Builder] v2.1.0-rc.10+
- [LoopBack Component Real-Time] v1.0.0-rc.5+
- [Socket IO] Adaptador *(cualquier socket.io-adapter como [socket.io-adapter-mongo], [socket.io-redis], etc)*
- PubSub capa de base de datos como [MongoDB] o [Redis]


## Creando el DataSource
Independientemente del origen de datos que seleccione para sus modelos de API, deberá crear una fuente de datos que apunte a una base de datos [MongoDB] o [Redis].

Si ya seleccionó [MongoDB] o [Redis] como base de datos para sus Modelos de API, no necesitará crear una nueva fuente de datos, los usuarios que utilicen otras bases de datos como SQL, * requerirá crear una nueva fuente de datos apuntando a [MongoDB] O [Redis] * e instale su correspondiente dependencia de [LoopBack].


````sh
$ cd to/project/api
$ npm install --save [loopback-connector-mongodb | loopback-connector-redis]
````

y como cualquier otro origen de datos [LoopBack], se configura de la siguiente forma:

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

## Habilitar el modo Clustering

Para habilitar el modo de Clustering, necesitamos realizar las siguientes configuraciones:

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

Tenga en cuenta que `adapter.name` debe ser el adaptador que ha seleccionado e instalado antes de este proceso, así como el` adapter.datasource` debe ser el nombre de la fuente de datos que ha creado.

Después de seguir las configuraciones anteriores, [FireLoop] funcionará en entornos de procesos o servidores agrupados.

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