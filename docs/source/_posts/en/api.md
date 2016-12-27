---
title: Api
lenguage: en
---

> You should [create an application] and [software development kit] by using the [FireLoop] CLI Tool before being able to use the following API.

## Importing RealTime Service
The [LoopBack SDK Builder] will generate and provide an [Angular 2] service that can be injected within our constructor as follows:

````js
import { Component } from '@angular/core';
import { RealTime } from './shared/sdk/services';

@Component(...)

export class AppComponent {
  constructor(private realTime: RealTime) {
    this.realTime.FireLoop // explore with intellisense
  }
}
````

## Waiting for Connection
When using any real-time feature, you first need to make sure your client application is connected with the server through web sockets.

The following example illustrates how to wait for a connection to be established by using the `onReady` method.

````js
import { Component } from '@angular/core';
import { RealTime } from './shared/sdk/services';

@Component(...)

export class AppComponent {
  constructor(private realTime: RealTime) {
    this.realTime
        .onReady()
        .subscribe(() => {
            // Register FireLoop References in here....
        });
  }
}
````

## How to Create Data
The following example will crate a new room instance through the new [FireLoop] API using WebSockets instead of the Standard [LoopBack] HTTP REST API protocol.
````js
import { Component } from '@angular/core';
import { RealTime } from './shared/sdk/services';
import { Room, FireLoopRef } from './shared/sdk/models';

@Component(...)

export class AppComponent {

  private room: Room = new Room({ name: 'Hello FireLoop Room' });
  private RoomReference: FireLoopRef<Room>;
  
  constructor(private realTime: RealTime) {
    this.realTime
        .onReady()
        .subscribe(() =>
            this.RoomReference = this.realTime.FireLoop.ref<Room>(Room)
        );
  }
  create(): void {
    this.RoomReference.create(this.room).subscribe((instance: Room) => console.log(instance));
  }
}
````
There will be always a new instance created after using the `create` method, but you can also use `upsert` which will `create` or `update` the instance.

````js
import { Component } from '@angular/core';
import { RealTime } from './shared/sdk/services';
import { Room, FireLoopRef } from './shared/sdk/models';

@Component(...)

export class AppComponent {

  private room: Room = new Room({ name: 'Hello FireLoop Room' });
  private RoomReference: FireLoopRef<Room>;

  constructor(private realTime: RealTime) {
    this.realTime
        .onReady()
        .subscribe(() =>
            this.RoomReference = this.realTime.FireLoop.ref<Room>(Room)
        );
  }
  
  upsert(): void {
    this.RoomReference.upsert(this.room).subscribe((instance: Room) => console.log(instance));
  }
}
````
By using upsert, [FireLoop] will verify if the item is already persisted and update it, otherwise it will create a new instance.

## How to Remove Data
The following example will remove a room instance through the new [FireLoop] API using WebSockets.

````js
import { Component } from '@angular/core';
import { RealTime } from './shared/sdk/services';
import { Room, FireLoopRef } from './shared/sdk/models';

@Component(...)

export class AppComponent {

  private room: Room = new Room({ name: 'Hello FireLoop Room' });
  private RoomReference: FireLoopRef<Room>;

  constructor(private realTime: RealTime) {
    this.realTime
        .onReady()
        .subscribe(() =>
            this.RoomReference = this.realTime.FireLoop.ref<Room>(Room)
        );
  }
  
  remove(room: Room): void {
    this.RoomReference.remove(room).subscribe((removed: Room) => {});
  }
}
````

## Available Events

| Event | Description |
|-------|-------------|
| change | This event will return an array of persisted elements and will keep firing on any change for the current Model Reference        |
| value | This event will return an array of persisted elements and will keep firing when new values are added in the current Model Reference        |
|  child_added     |  This event will fire once for each persisted items and will keep firing when new values are added in the current Model Reference, returning only the newly created child element           |
| child_changed   | This event will fire once for each changed item. It will return a reference of the updated element  |
| child_removed   | This event will fire once for each removed items It will return a reference of the removed element  |


## Read Data Using 'change' Event
This is the recommended read event for real-time lists because it will be in sync any time there is a reference modification; this means that at any addition, removal or modification of any child within the reference will trigger a client synchronization.

````js
import { Component } from '@angular/core';
import { RealTime } from './shared/sdk/services';
import { Room, FireLoopRef } from './shared/sdk/models';

@Component(...)

export class AppComponent {

  private RoomReference: FireLoopRef<Room>;

  constructor(private realTime: RealTime) {
    this.realTime
        .onReady()
        .subscribe(() =>
            this.RoomReference = this.realTime.FireLoop.ref<Room>(Room)
            this.RoomReference.on('change').subscribe((rooms: Array<Room>) => console.log(rooms));
        );
  }
}
````

## Read Data Using 'value' Event
Similar to Firebase, you are now able to listen for references changes by subscribing to the `value` event.

````js
import { Component } from '@angular/core';
import { RealTime } from './shared/sdk/services';
import { Room, FireLoopRef } from './shared/sdk/models';

@Component(...)

export class AppComponent {

  private RoomReference: FireLoopRef<Room>;

  constructor(private realTime: RealTime) {
    this.realTime
        .onReady()
        .subscribe(() =>
            this.RoomReference = this.realTime.FireLoop.ref<Room>(Room)
            this.RoomReference.on('value').subscribe((rooms: Array<Room>) => console.log(rooms));
        );
  }
}
````
The example above will list the persisted items (Rooms) the first time and will keep firing every time there is a new value added.

When not query is defined the `value` Event will return the latest 100 records from the database. 

## Listen 'child_added' Event

````js
import { Component } from '@angular/core';
import { RealTime } from './shared/sdk/services';
import { Room, FireLoopRef } from './shared/sdk/models';

@Component(...)

export class AppComponent {

  private RoomReference: FireLoopRef<Room>;

  constructor(private realTime: RealTime) {
    this.realTime
        .onReady()
        .subscribe(() =>
            this.RoomReference = this.realTime.FireLoop.ref<Room>(Room)
            this.RoomReference.on('child_added').subscribe((room: Room) => console.log(room));
        );
  }
}
````
## Listen 'child_changed' Event

````js
import { Component } from '@angular/core';
import { RealTime } from './shared/sdk/services';
import { Room, FireLoopRef } from './shared/sdk/models';

@Component(...)

export class AppComponent {

  private RoomReference: FireLoopRef<Room>;

  constructor(private realTime: RealTime) {
    this.realTime
        .onReady()
        .subscribe(() =>
            this.RoomReference = this.realTime.FireLoop.ref<Room>(Room)
            this.RoomReference.on('child_changed').subscribe((room: Room) => console.log(room));
        );
  }
}
````

## Listen 'child_removed' Event

````js
import { Component } from '@angular/core';
import { RealTime } from './shared/sdk/services';
import { Room, FireLoopRef } from './shared/sdk/models';

@Component(...)

export class AppComponent {

  private RoomReference: FireLoopRef<Room>;

  constructor(private realTime: RealTime) {
    this.realTime
        .onReady()
        .subscribe(() =>
            this.RoomReference = this.realTime.FireLoop.ref<Room>(Room)
            this.RoomReference.on('child_removed').subscribe((room: Room) => console.log(room));
        );
  }
}
````

## Querying Data
Since the built in [LoopBack] Query Language is really mature, I decided to keep using it in order to allow you pull the information according your necessities.

````js
import { Component } from '@angular/core';
import { RealTime } from './shared/sdk/services';
import { Room, FireLoopRef } from './shared/sdk/models';

@Component(...)

export class AppComponent {

  private RoomReference: FireLoopRef<Room>;

  constructor(private realTime: RealTime) {
    this.realTime
        .onReady()
        .subscribe(() =>
            this.RoomReference = this.realTime.FireLoop.ref<Room>(Room)
            this.RoomReference.on('change',{
              limit: 10,
              order: 'id DESC',
              include: 'members'
            }).subscribe((rooms: Room[]) => console.log(rooms));
        );
  }
}
````
For more information about how to query data see the following [documentation](https://docs.strongloop.com/display/public/LB/Querying+data)

## Working with Child References
Working with child references will allow you to persist a relation between a parent and a child reference. For instance when creating messages in a room chat, we want these to be persisted within the right Room.

````js
import { Component } from '@angular/core';
import { RealTime } from './shared/sdk/services';
import { Room, Message, FireLoopRef } from './shared/sdk/models';

@Component(...)

export class AppComponent {

  private RoomReference: FireLoopRef<Room>;
  private MessageReference: FireLoopRef<Message>;
  private room: Room = new Room({ name: 'FireLoop Room' });
  private message: Room = new Message({ text: 'Test Message' });

  constructor(private realTime: RealTime) {
    this.realTime
        .onReady()
        .subscribe(() =>
            this.RoomReference = this.realTime.FireLoop.ref<Room>(Room)
            this.RoomReference.upsert(this.room).subscribe((instance: Room) => {
             // Create a Child Reference
             this.MessageReference = RoomReference.make(instance).child<Message>('messages');
             this.MessageReference.on('value').subscribe(
                (messages: Array<Message>) => this.logger.info(messages)
              );
              MessageReference.upsert(this.message).subscribe((res: Message) => console.log(res.text));
            }))
        );
  }
}
````
The example above will create a new Room and then will create a MessageReference, now you can store or listen for messages within this specific room. Everything related with this reference will persist the relationship Parent -> Child.

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
[create an application]: https://github.com/mean-expert-official/fireloop.io/wiki/Creating-Client-Applications
[software development kit]: https://github.com/mean-expert-official/fireloop.io/wiki/Creating-Client-SDK