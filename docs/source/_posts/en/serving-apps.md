---
title: Serving Applications
lenguage: en 
---

[FireLoop] is able to run all of your project applications at once (including your server), for this you can use the `fireloop serve` command and select the applications you want to serve.

````sh
$ cd myproject
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
````

It is important to note that both, client and server applications will be running in [TypeScript] and loaded with livereload mechanisms according the environment.

This means that once your applications are running, these will be restared by any code modification and recompiled to be live reloaded.

[TypeScript]: http://typescriptlang.org
[FireLoop]: http://fireloop.io
[create an application]: https://github.com/mean-expert-official/fireloop.io/wiki/Creating-Client-Applications