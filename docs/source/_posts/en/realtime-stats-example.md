---
title: Real Time Stats Example
Lenguage: en
---
![Real-Time Statistics](https://storage.googleapis.com/mean-expert-images/realtime-stats.jpg)


## Project Description

To demonstrate what can be achieved with [FireLoop], I have decided to create an application that will render statistical charts with real-time data coming from a [FireLoop] project. This will be kind of a regular Todo Application, but this time we will set a due date for our todos, this way we can render some statistical information about it and play better with it.

## Project Repository

For this example I have created a repository that you can use as playground.

[CLICK HERE FOR GITHUB REPO](https://github.com/mean-expert-official/fireloop-todo-example)

## Install FireLoop
Of course, the very first step we'll want to take, is to install our [FireLoop] CLI Tool.

```sh
$ npm install -g @mean-expert/fireloop
```

## Create FireLoop Project
Now that we have our [FireLoop] CLI Tool installed, we can go ahead and create our first [FireLoop] Project.

In order to create a [FireLoop] Project, you will need to create a new folder directory in any file system location of your preference, then run the `$ fireloop` command and finally hit return for all of the displayed options.

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

Great, now we have created a [FireLoop] Project with the minimum amount of effort. So... what if we follow the `Next Steps` tips and then we just create our Todo Model.

## Create Todo Model
For this we are going to use the `$ fireloop model [ModelName]` command and then add a couple of properties.

Basically you just hit return until you reach the properties section and you add the `text: string && dueAt: date` attributes.

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

If you have been using [LoopBack], you will notice that under the hood I'm using the loopback generator for this operation, but at the end; The [FireLoop] CLI Tool takes control and it will create a modified version of a [LoopBack] Model. If you open the `./common/models/todo.ts` file, you will find the new [TypeScript] structure for our Back End Models.

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

Any logic related to our Todo Model in the Back-End should be placed in this [TypeScript] File, though for this demo we are going to leave it as it is. But, what we really want to do is to update our Todo Model statistical configurations. 

Please open the file `./common/models/todo.json` and update it as follows:

````json
{
  ...
  "mixins": {
    ...
    "Stats": [
      {
        ...
        "count": {
          "on": "dueAt" // <---- change createdAt for dueAt
        }
      }
    ]
  }
}
````

What we are doing here is to tell the stats mixing to rely on the dueAt property, this way our statistical information will be generated according the todo due dates instead of when the todo was created.


## Disable Auth Feature

For this project and for practical purposes, we won't use the authentication mechanism since I don't want to spend time creating register/login sections, but I promise I will be creating a tutorial for authentication really soon.

For this open the server/component-config.json file and modify as follows:

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

Ok, for this project... That is all we need to do within our Back End. Now, it is time to create our [Angular 2] Client.

## Create Angular 2 Web Client

We can create [Angular 2] clients by using the [FireLoop] command: `$ fireloop`

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

When following the process described above, several thing happen under the hood.

- [FireLoop] internally uses [Angular CLI] to create an [Angular 2] project.
- [FireLoop] generates a SDK for your new [Angular 2] Client App to be fully connected with your [LoopBack] API.
- [FireLoop] installs the SDK and its dependencies, including types.

At the end of the process you won't need to worry about any integration or configuration, everything has been automatically done for you!!!.
[Public cheering in the background]

## Install NG2 Charts

Now that you avoided a good amount of configurations and integrations, you are ready to start working over the client application.

For this project I have decided to use [Ng2Charts] to render our charts, but you can also check [this tutorial for building your own custom charts](/2016/09/17/angular-2-chart-component-revised/).

````sh
$ cd webapp
$ npm install --save ng2-charts chart.js moment
````

#### Customizing The File System Structure
As you can see, you need to enter the webapp (or whatever name you chose for your app) directory and then install from there its own dependencies. This is because even-though you have a workspace for it, we want to keep the dependencies and the actual clients as decoupled as possible from the server.

This means that you don't need to have in 1 place the modules for the server and the modules for [NativeScript] because it does not make sense.

So... Why then are we creating everything within the same project? The short answer is for convenience, because remember that [FireLoop] integrates for you a full stack solution, allowing you to automatically build sdks for any of your clients and adding exclusive real-time and statistical functionalities without any configuration or extra effort.

But, if you don't really like to have your webapp or any client within the same directory as the [FireLoop] project you can actually change that.

Just open the .yo-rc.json file and update the client path to any location of your preference

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

Of course, you may want to move some of these clients away; because you may want to have separated repositories and just because it does't make sense to have it in one place when talking about mobile applications. Just remember you can still have your server and clients integrated through [FireLoop] regardless of the file system directory.

Anyway, in some cases it does make sense to have everything in 1 place; And the best of the examples will be the [Angular Universal] integration, that actually needs to be served from the [LoopBack] server.

Ok.. cool, now that I clarified how to customize the project structure, lets have some fun by building our real-time client application.

## Update AppModule

First of all, lets open the `fireloop_project/webapp/src/app/app.module.ts` and tell [Angular 2] that we want to use the [Ng2Charts] Module.

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

Awesome, as simple as that our [Angular 2] Application is ready to start rendering real-time charts.

## Add FireLoop Logic

Lets now update our `fireloop_project/webapp/src/app/app.component.ts` file as follows:

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

I believe this code is pretty straight forward, basically you just need to create 1 Todo Model instance, 1 FireLoop Reference and a couple of methods to wrap the functionality, other than that is matter of connecting the pieces together.

If you figured out already, you should know that in a really smart way... You have access within your [Angular 2] client to your backend models, in this case we created a Todo Model that works across the Back and Front Ends.

The other super important piece in here is the FireLoop Reference, this service allows you to sync your client applications with the back end server by providing you with methods that allow you to create, update, remove, listen for changes and listen for stats.

A good example can be seen within the constructor, we are subscribing to the stats method in order to listen for real-time statistics, this is really cool.

````js
  constructor(private rt: RealTime) {
    this.todoRef = this.rt.FireLoop.ref<Todo>(Todo);
    this.todoRef.stats().subscribe((stats: any) => console.log(stats));
  }
````

Great, every time something changes within the FireLoop Todo Reference, you will get some statistical information about it, but... At this moment we are just sending to the console our stats, lets add the chart logic.

## Add Ng2Charts Logic

What I'm adding here is just the standard configuration for a line chart that I took from their [documentation](https://github.com/valor-software/ng2-charts).

Our `app.component.ts` will finally be something like:

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

Here we are just adding a couple of configurations to decide which colors to be used, etc. But you should be able to see that now we are mapping our stats to be rendered by [Ng2Charts].

## Update App Component View

Lets now update our `fireloop_project/webapp/src/app/app.component.html` file as follows:

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

Cool, how easy was that? we just bind everything associated to our component logic and here we are, with a full stack real-time application that is ready to be tested.

## Test

Lets now run our fireloop project bu running `$ fireloop serve` and then select both, your client and server by using the sapace bar and then just hit return to load them.

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

And *Voilà*... Just open 2 browser in [http://127.0.0.1:4200](http://127.0.0.1:4200) so you can verify both are updated in real-time.

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