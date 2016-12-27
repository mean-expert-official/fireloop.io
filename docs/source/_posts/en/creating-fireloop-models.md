---
title: Creating FireLoop Models
lenguage: en
---

When you start building a system, the fist thing you need to do right after your setup, is to start creating your API Models.

This models are similar to [LoopBack] Models, but with a difference... This models will be created and executed using [TypeScript] instead of JavaScript. (POW!)

##  Creating FireLoop Models

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

If you have experience with [LoopBack] you will see it is the same creational flow, is just that as described before; The model will be created in [TypeScript] Language.

## Model Structure
Now that your Models are in  [TypeScript] you will see these are different in structure to the [LoopBack] ones, but it has the exact same functionality.

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