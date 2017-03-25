---
title: Creación de modelos FireLoop
lenguage: es
---

Cuando empiece a construir un sistema, lo primero que debe hacer justo después de su instalación, es comenzar a crear sus Modelos de API.

Estos modelos son similares a [LoopBack] Modelos, pero con una diferencia ... Estos modelos serán creados y ejecutados usando [TypeScript] en lugar de JavaScript. (POW!)

##  Creación de modelos FireLoop

````sh
$ cd myproject
$ fireloop model MyModel

? Enter the model name: MyModel
? Select the data-source to attach MyModel to: db (memory)
? Select model's base class PersistedModel
? Expose MyModel via the REST API? Yes
? Custom plural form (used to build REST URL): 
? Common model or server only? common
Let's add some MyModel properties now.

Enter an empty property name when done.
? Property name: text
   invoke   loopback:property
? Property type: string
? Required? No
? Default value[leave blank for none]: 

Let's add another MyModel property.
Enter an empty property name when done.
? Property name: 

Generating: ./common/models/my-model.ts
````

Si usted tiene experiencia con [LoopBack] verá que es el mismo flujo creacional, es sólo que como se describió anteriormente; El modelo se creará en [TypeScript] Language.

## Estructura del Modelo
Ahora que sus modelos están en [TypeScript] verá que estos son diferentes en estructura a los [LoopBack], pero tiene la misma funcionalidad exacta.

````js
import { Model } from '@mean-expert/model';
/**
 * @module Todo
 * @description
 * Write a useful Todo Model description.
 * Register hooks and remote methods within the
 * Model Decorator
 **/
@Model({
  hooks: {
    beforeSave: { name: 'before save', type: 'operation' }
  },
  remotes: {
    myRemote: {
      returns : { arg: 'result', type: 'array' },
      http    : { path: '/my-remote', verb: 'get' }
    }
  }
})

class Todo {
  // LoopBack model instance is injected in constructor
  constructor(public model: any) {}

  // Example Operation Hook
  beforeSave(ctx: any, next: Function): void {
    console.log('Todo: Before Save');
    next();
  }
  // Example Remote Method
  myRemote(next: Function): void {
    this.model.find(next);
  }
}

module.exports = Todo;
````

[NodeJS]: http://nodejs.org
[Horizon]: http://horizon.io/
[FireLoop]: http://fireloop.io
[FireLoop.io]: http://fireloop.io
[FireBase]: https://firebase.google.com/
[Google's FireBase]: https://firebase.google.com/
[Angular 2]: http://angular.io
[LoopBack]: http://loopback.io
[IBM's StrongLoop LoopBack]: http://loopback.io
[LoopBack SDK Builder]: http://github.com/mean-expert-official/loopback-sdk-builder
[loopback-sdk-angular]: http://npmjs.org/package/loopback-sdk-angular
[loopback-component-pubsub]: http://npmjs.org/package/loopback-component-pubsub
[LoopBack Component Real-Time]: http://github.com/mean-expert-official/loopback-component-realtime
[TypeScript]: https://www.typescriptlang.org
[SDK Builder]: https://github.com/mean-expert-official/loopback-sdk-builder