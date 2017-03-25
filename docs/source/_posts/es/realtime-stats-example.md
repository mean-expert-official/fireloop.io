---
title: Ejemplo de Estatisticas RealTime
Lenguage: es
---
![Real-Time Statistics](https://storage.googleapis.com/mean-expert-images/realtime-stats.jpg)

## Descripción del Proyecto

Para demostrar lo que se puede lograr con [FireLoop], he decidido crear una aplicación que procese gráficos estadísticos con datos en tiempo real procedentes de un proyecto [FireLoop]. Este será un tipo de aplicación Todo Todo, pero esta vez vamos a fijar una fecha de vencimiento para todos nuestros, de esta manera podemos hacer alguna información estadística sobre ella y jugar mejor con ella.

## Repositorio del proyecto

Para este ejemplo he creado un repositorio que puedes usar como patio de recreo.

[HAGA CLIC AQUÍ PARA GITHUB REPO](https://github.com/mean-expert-official/fireloop-todo-example)

## Instalar FireLoop
Por supuesto, el primer paso que queremos tomar es instalar nuestra Herramienta de CLI [FireLoop].

```sh
$ npm install -g @mean-expert/fireloop
```

## Crear proyecto FireLoop.
Ahora que tenemos nuestra Herramienta CLI [FireLoop] instalada, podemos seguir adelante y crear nuestro primer proyecto [FireLoop].

Para crear un proyecto [FireLoop], necesitará crear un nuevo directorio de carpetas en cualquier ubicación de sistema de archivos de su preferencia, luego ejecutar el comando `$ fireloop` y finalmente pulsar return para todas las opciones mostradas.

````sh
$ mkdir fireloop_project && cd fireloop_project
$ fireloop

     _-----_     ╭──────────────────────────╮
    |       |    │   Welcome to FireLoop!   │
    |--(o)--|    │  The MEAN Stack Platform │
  \`---------´   │      by MEAN Expert      │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |     
   __'.___.'__   
 ´   `  |° ´ Y \` 

? What do you want to do? (Use arrow keys)
❯ Generate FireLoop Project 
  Show FireLoop Version 


? What\'s the name of your application? fireloop_project
? Which version of LoopBack would you like to use? 2.x (stable)
? What kind of application do you have in mind? api-server (A LoopBack API server with local User auth)

Next steps:

	Create a model in your server
		$ fireloop model [ModelName]

	Create a new Angular 2 Client or SDK
		$ fireloop

	Serve an application
		$ fireloop serve

````

Genial, ahora hemos creado un proyecto [FireLoop] con la cantidad mínima de esfuerzo. Así que ... ¿qué pasa si seguimos los consejos de los 'próximos pasos' y luego simplemente creamos nuestro modelo Todo.

## Crear Modelo Todo
Para ello vamos a utilizar el comando `$ fireloop model [ModelName]` y luego añadir un par de propiedades.

Básicamente, simplemente pulsa return hasta llegar a la sección de propiedades y agrega los atributos `text: string && dueAt: date`.

````sh
$ fireloop model Todo

? Enter the model name: Todo
? Select the data-source to attach Todo to: db (memory)
? Select model´s base class PersistedModel
? Expose Todo via the REST API? Yes
? Custom plural form (used to build REST URL): 
? Common model or server only? common
Let´s add some Todo properties now.

 Property text: string
Enter an empty property name when done.
? Property name: text
? Property type: string
? Required? Yes
? Default value[leave blank for none]: 

 Property dueAt: date
Let´s add another Todo property.
Enter an empty property name when done.
? Property name: dueAt
? Property type: date
? Required? Yes
? Default value[leave blank for none]: 

Let´s add another Todo property.
Enter an empty property name when done.
? Property name: 

Generating: ./common/models/todo.ts
````

Si ha estado usando [LoopBack], notará que bajo el capó estoy usando el generador de loopback para esta operación, pero al final; La herramienta [FireLoop] CLI toma el control y creará una versión modificada de un modelo [LoopBack]. Si abre el archivo `. / Common / models / todo.ts`, encontrará la nueva estructura [TypeScript] para nuestros modelos de back-end.

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

Cualquier lógica relacionada con nuestro Modelo Todo en el Back-End debe colocarse en este archivo [TypeScript], aunque para esta demo lo vamos a dejar como está. Pero, lo que realmente queremos hacer es actualizar nuestras configuraciones estadísticas de Todo el Modelo.

Abra el archivo `/ common / models / todo.json` y actualícelos de la manera siguiente:

````json
{
  ...
  "mixins": {
    ...
    "Stats": [
      {
        ...
        "count": {
          "on": "dueAt" // <---- cambia createdAt por dueAt
        }
      }
    ]
  }
}
````

Lo que estamos haciendo aquí es decir que las estadísticas se mezclan para confiar en la propiedad dueAt, de esta manera nuestra información estadística se generará de acuerdo a las fechas de entrega de todo en lugar de cuando se creó el todo


## Desactivar la función Auth

Para este proyecto y para fines prácticos, no utilizaremos el mecanismo de autenticación ya que no quiero dedicar tiempo a crear secciones de registro / inicio de sesión, pero prometo que voy a crear un tutorial para la autenticación muy pronto.

Para ello, abra el archivo server/component-config.json y modifíquelo de la siguiente manera:

````json
{
  "loopback-component-explorer": {
    "mountPath": "/explorer"
  },
  "@mean-expert/loopback-component-realtime": {
    "auth": false, // <--- Change this to false
    "debug": false
  }
}
````

Ok, para este proyecto ... Eso es todo lo que necesitamos hacer dentro de nuestro Back End. Ahora, es hora de crear nuestro [Angular 2] Cliente.

## Crear cliente Web Angular 2

Podemos crear clientes [Angular 2] usando el comando [FireLoop]: `$ fireloop`

````sh
$ fireloop

     _-----_     ╭──────────────────────────╮
    |       |    │   Welcome to FireLoop!   │
    |--(o)--|    │  The MEAN Stack Platform │
   `---------´   │      by MEAN Expert      │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |     
   __'.___.'__   
 ´   `  |° ´ Y ` 

? What do you want to do? (Use arrow keys)
❯ Generate Angular2 Client 

? What type of Angular 2 Application do you want to create? Angular 2 for Web
? What's the name of your application? webapp
````

Al seguir el proceso descrito anteriormente, suceden varias cosas bajo el capó.

- [FireLoop] Internamente utiliza [Angular CLI] para crear un proyecto [Angular 2].
- [FireLoop] Genera un SDK para que su nueva aplicación cliente [Angular 2] esté totalmente conectada con su API [LoopBack].
- [FireLoop] Instala el SDK y sus dependencias, incluidos los tipos.

Al final del proceso no tendrá que preocuparse por ninguna integración o configuración, todo se ha hecho automáticamente para usted !!!.
[El público anima en el fondo :D]

## Instalar NG2 Charts

Ahora que ha evitado una buena cantidad de configuraciones e integraciones, está listo para comenzar a trabajar sobre la aplicación cliente.

Para este proyecto he decidido utilizar [Ng2Charts] para procesar nuestros gráficos, pero también puedes comprobar [Este tutorial para crear sus propios gráficos personalizados](/2016/09/17/angular-2-chart-component-revised/).

````sh
$ cd webapp
$ npm install --save ng2-charts chart.js moment
````

#### Personalización de la estructura del sistema de archivos
Como puedes ver, debes ingresar el directorio de la aplicación web (o cualquier nombre que hayas elegido para tu aplicación) y luego instalar desde allí tus propias dependencias. Esto se debe a que aunque tengamos un espacio de trabajo para ello, queremos mantener las dependencias y los clientes reales tan desacoplados como sea posible del servidor.

Esto significa que no es necesario tener en 1 lugar los módulos para el servidor y los módulos para [NativeScript] porque no tiene sentido.

Entonces ... ¿Por qué entonces estamos creando todo dentro del mismo proyecto? La respuesta corta es por comodidad, porque recuerde que [FireLoop] integra para usted una solución de pila completa, lo que le permite crear automáticamente sdks para cualquiera de sus clientes y agregar funcionalidades exclusivas en tiempo real y estadística sin ninguna configuración o esfuerzo adicional.

Pero, si realmente no te gusta tener tu webapp o cualquier cliente dentro del mismo directorio que el proyecto [FireLoop], puedes cambiarlo.

Simplemente abra el archivo .yo-rc.json y actualice la ruta del cliente a cualquier ubicación de su preferencia

````json
{
  "generator-fireloop": {
    "version": "1.0.0-beta.1",
    "clients": {
      "webapp": {
        "path": "./webapp", // <--- Move your project out of the FireLoop directory and update the path reference here
        "type": "web"
      }
    }
  },
  "generator-loopback": {}
}
````

Por supuesto, usted puede desear mover algunos de estos clientes lejos; Porque es posible que desee tener depósitos separados y sólo porque no tiene sentido tenerlo en un lugar cuando se habla de aplicaciones móviles. Sólo recuerde que todavía puede tener su servidor y los clientes integrados a través de [FireLoop], independientemente del directorio del sistema de archivos.

De todos modos, en algunos casos tiene sentido tener todo en 1 lugar; Y el mejor de los ejemplos será la integración [Angular Universal], que realmente necesita ser servida desde el servidor [LoopBack].

Ok .. fresco, ahora que he aclarado cómo personalizar la estructura del proyecto, vamos a tener un poco de diversión mediante la construcción de nuestra aplicación cliente en tiempo real.

## Actualizar el AppModule

En primer lugar, permite abrir el `fireloop_project / webapp / src / app / app.module.ts` y decir [Angular 2] que queremos utilizar el módulo [Ng2Charts].

````js
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SDKModule } from './shared/sdk/index';
import { AppComponent } from './app.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    SDKModule.forRoot(),
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
````

Impresionante, tan simple como que nuestra aplicación [Angular 2] está lista para empezar a representar gráficos en tiempo real.

## Agregar logica del Fireloop

Permite ahora actualizar nuestro archivo `fireloop_project /webapp/src/app/app.component.ts` de la siguiente manera:

````js
import { Component } from '@angular/core';
import { Todo, FireLoopRef } from './shared/sdk/models';
import { RealTime } from './shared/sdk/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  private title   : string = 'Todo app works!';
  private todo    : Todo   = new Todo();
  private todoRef : FireLoopRef<Todo>;

  constructor(private rt: RealTime) {
    this.rt.onReady().subscribe(() => {
      this.todoRef = this.rt.FireLoop.ref<Todo>(Todo);
      this.todoRef.stats().subscribe((stats: any) => console.log(stats));
    });
  }

  create(): void {
    this.todoRef.create(this.todo).subscribe(() => this.todo = new Todo());
  }

  update(todo: Todo): void {
    this.todoRef.upsert(todo).subscribe();
  }

  remove(todo: Todo): void {
    this.todoRef.remove(todo).subscribe();
  }
}
````

Creo que este código es bastante sencillo, básicamente sólo tiene que crear 1 Todo Modelo instancia, 1 FireLoop Reference y un par de métodos para envolver la funcionalidad, con excepción de que es cuestión de conectar las piezas juntas.

Si ya lo has descubierto, deberías saberlo de una manera realmente inteligente ... Tienes acceso dentro de tu cliente [Angular 2] a tus modelos de backend, en este caso creamos un Todo Model que funciona a través de los extremos trasero y frontal.

La otra pieza súper importante de aquí es FireLoop Reference, este servicio le permite sincronizar sus aplicaciones cliente con el servidor back-end, proporcionándole métodos que le permiten crear, actualizar, eliminar, escuchar cambios y escuchar estadísticas.


Un buen ejemplo se puede ver dentro del constructor, estamos suscribiendo al método stats para escuchar estadísticas en tiempo real, esto es realmente genial.
````js
  constructor(private rt: RealTime) {
    this.todoRef = this.rt.FireLoop.ref<Todo>(Todo);
    this.todoRef.stats().subscribe((stats: any) => console.log(stats));
  }
````

Es genial, cada vez que algo cambia dentro de FireLoop Todo, obtendrás información estadística sobre él, pero ... En este momento estamos enviando a la consola nuestras estadísticas, vamos a agregar la lógica del gráfico.

## Agregar logica del Ng2Charts

Lo que estoy agregando aquí es sólo la configuración estándar para un gráfico de líneas que tomé de su [documentación](https://github.com/valor-software/ng2-charts).

Nuestro `app.component.ts` finalmente será algo como:

````js
require('chart.js');

import { Component } from '@angular/core';
import { Todo, FireLoopRef } from './shared/sdk/models';
import { RealTime } from './shared/sdk/services';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  private title   : string = 'Todo app works!';
  private todo    : Todo   = new Todo();
  private todoRef : FireLoopRef<Todo>;
  private lineChartData:Array<any> = [];
  private lineChartLabels:Array<any> = [];
  private lineChartOptions:any = {
    animation: false,
    responsive: false
  };
  private lineChartColors:Array<any> = [
    { 
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  private lineChartLegend:boolean = true;
  private lineChartType:string = 'line';

  constructor(private rt: RealTime) {
    this.rt.onReady().subscribe(() => {
      this.todoRef = this.rt.FireLoop.ref<Todo>(Todo);
      this.todoRef.stats().subscribe((stats: any) => {
        this.lineChartLabels = new Array();
        this.lineChartData   = new Array();
        let data = new Array();
        stats.forEach((stat: any) => {
          data.push(stat.count);
          this.lineChartLabels.push(moment(stat.universal).format('MM-YYYY'));
        });
        this.lineChartData.push({ data: data, label: 'Number of Dued Todos'});
      });
    });
  }

  create(): void {
    this.todoRef.create(this.todo).subscribe(() => this.todo = new Todo());
  }

  update(todo: Todo): void {
    this.todoRef.upsert(todo).subscribe();
  }

  remove(todo: Todo): void {
    this.todoRef.remove(todo).subscribe();
  }
}

````

Aquí solo estamos agregando un par de configuraciones para decidir qué colores usar, etc. Pero deberías ser capaz de ver que ahora estamos mapeando nuestras estadísticas para ser renderizadas por [Ng2Charts].

## Actualizar vista de componente de aplicación

Permite ahora actualizar nuestro archivo `fireloop_project/webapp/src/app/app.component.html` de la siguiente manera:

````html
<h1>
  {{title}}
</h1>
<form (submit)="create()">
  <input name="todo" type="text" [(ngModel)]="todo.text" placeholder="Add Todo" />
  <input name="todo" type="date" [(ngModel)]="todo.dueAt" placeholder="Due Date" />
  <button>Add Todo</button>
</form>
<ul>
  <li *ngFor="let _todo of todoRef.on('change') | async">
    <input name="_todo.id" [(ngModel)]="_todo.text" />
    <button (click)="update(_todo)">Update</button>
    <button (click)="remove(_todo)">Remove</button>
  </li>
</ul>
<div class="row">
  <div class="col-md-6">
    <div style="display: block;">
    <canvas *ngIf="lineChartData.length > 0" baseChart width="400" height="400"
                [datasets]="lineChartData"
                [labels]="lineChartLabels"
                [options]="lineChartOptions"
                [colors]="lineChartColors"
                [legend]="lineChartLegend"
                [chartType]="lineChartType"></canvas>
    </div>
  </div>
</div>
````

Cool, ¿qué tan fácil fue eso? Simplemente enlazamos todo lo relacionado con nuestra lógica de componentes y aquí estamos, con una aplicación en tiempo real de pila completa que está lista para ser probada.

## Test

Ahora ejecutamos nuestro buff de proyecto fireloop ejecutando `$ fireloop service` y luego seleccionamos ambos, tu cliente y servidor usando la barra de sapace y luego solo pulsamos return para cargarlos.

````sh
$ fireloop serve

     _-----_     
    |       |    ╭──────────────────────────╮
    |--(o)--|    │      Let's serve an      │
   `---------´   │       application!       │
    ( _´U`_ )    ╰──────────────────────────╯
    /___A___\   /
     |  ~  |     
   __'.___.'__   
 ´   `  |° ´ Y ` 

? What application do you want to serve? (Press <space> to select, <a> to toggle all, <i> to inverse selection)
❯◯ webapp
 ◯ server
  ...
	Loading Client Application: webapp
	Loading Server Application: server
````

Y * Voilà * ... Sólo tienes que abrir el navegador 2 en [http://127.0.0.1:4200](http://127.0.0.1:4200) para que puedas verificar que ambos se actualizan en tiempo real.

[FireLoop Stats Gif Example](https://storage.googleapis.com/mean-expert-images/fireloop-stats.gif)



[NodeJS]: http://nodejs.org
[NPM]: http://npmjs.org
[LoopBack]: http://loopback.io
[Ionic 2]: http://ionic.io
[NativeScript]: http://nativescript.org
[Angular 2]: http://angular.io
[LoopBack SDK Builder]: https://www.npmjs.com/package/@mean-expert/loopback-sdk-builder
[LoopBack Component Real-Time]: https://www.npmjs.com/package/@mean-expert/loopback-component-realtime
[IBM's StrongLoop LoopBack Framework]: http://loopback.io
[Google's Angular 2 Framework]: http://angular.io
[Telerik's NativeScript 2]: http://nativescript.org
[TypeScript]: http://typescriptlang.org
[D3JS]: https://d3js.org/
[Angular CLI]: http://cli.angular.io
[Part 1]: /2016/04/13/loopback-stats-mixin
[Part 2]: /2016/04/21/loopback-stats-mixin-part2
[Part 3]: /2016/09/10/angular-2-and-loopback-revised
[Part 4]: /2016/09/17/angular-2-chart-component-revised/
[D3]: https://d3js.org
[ng2d3]: https://github.com/swimlane/ng2d3
[FireLoop]: http://fireloop.io
[MEAN Expert]: http://mean.expert
[Ng2Charts]: http://valor-software.com/ng2-charts/
[Angular Universal]: http://universal.angular.io