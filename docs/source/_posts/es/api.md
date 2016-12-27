---
title: Api
lenguage: es
---

> Debería [crear una aplicación] y [software development kit] utilizando la Herramienta de CLI [FireLoop] antes de poder utilizar la siguiente API.

## Importación de servicio RealTime

El [LoopBack SDK Builder] generará y proporcionará un servicio [Angular 2] que se puede inyectar dentro de nuestro constructor de la siguiente manera:

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

## Esperando la conexión
Al utilizar cualquier característica en tiempo real, primero debe asegurarse de que su aplicación cliente está conectada con el servidor a través de sockets web.

El siguiente ejemplo ilustra cómo esperar a que se establezca una conexión mediante el método `onReady`.

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

## Cómo crear datos
El siguiente ejemplo creará una nueva instancia de sala a través de la nueva API [FireLoop] utilizando WebSockets en lugar del protocolo API de REST de HTTP estándar [LoopBack].

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
Siempre habrá una nueva instancia creada después de usar el método `create`, pero también puede usar` upsert` que `create` o el `update` de la instancia.

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
Utilizando upsert, [FireLoop] comprobará si el elemento ya se ha persistido y lo actualiza, de lo contrario creará una nueva instancia.

## Cómo quitar datos
El ejemplo siguiente eliminará una instancia de sala a través de la nueva API [FireLoop] que usa WebSockets.

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

## Eventos disponibles

| Event | Description |
|-------|-------------|
| change | Este evento devolverá una matriz de elementos persistentes y continuará disparando en cualquier cambio para la referencia de modelo actual.        |
| value | Este evento devolverá una matriz de elementos persistentes y continuará disparando cuando se agreguen nuevos valores en la referencia de modelo actual.           |
| child_changed   | Este evento se disparará una vez por cada elemento persistido y continuará disparando cuando se agreguen nuevos valores en la Referencia del Modelo actual, devolviendo sólo el elemento hijo recién creado  |
| child_removed   | Este evento se disparará una vez para cada elemento cambiado  |


## Leer datos utilizando el evento 'change'
Este es el evento de lectura recomendado para las listas en tiempo real porque estará sincronizado en cualquier momento en que haya una modificación de referencia; Esto significa que en cualquier adición, eliminación o modificación de cualquier niño dentro de la referencia activará una sincronización de cliente.

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

## Leer datos utilizando el evento 'value'
Similar a Firebase, ahora puede escuchar los cambios de referencias suscribiéndose al evento `value`.

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
El ejemplo anterior lista los elementos persistentes (Salas) la primera vez y continuará disparando cada vez que haya un nuevo valor agregado.

Cuando no se define la consulta, el evento `value` devolverá los últimos 100 registros de la base de datos.

## Escucha el evento 'child_added'

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
## Escucha el evento 'child_changed'

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

## Escucha el evento 'child_removed'

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

## Consultar datos
Desde el construido en [LoopBack] Query Language es realmente maduro, decidí seguir usando para permitir que tire de la información de acuerdo a sus necesidades.

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
Para obtener más información acerca de cómo consultar datos, consulte la siguiente  [documentation](https://docs.strongloop.com/display/public/LB/Querying+data)

## Trabajar con referencias de Child
Trabajar con referencias Child le permitirá persistir una relación entre un padre y una referencia de niño. Por ejemplo, al crear mensajes en una sala de chat, queremos que se persistan dentro de la habitación correcta.

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
El ejemplo anterior creará una nueva Sala y luego creará una MessageReference, ahora puede almacenar o escuchar mensajes dentro de esta sala específica. Todo lo relacionado con esta referencia persistirá la relación Parent -> Child.

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