---
title: Creating Client SDK
lenguage: en
---

The [FireLoop] integration is built in the SDK, so you just need to generate one and install it by using the CLI Tool.

````sh
$ cd myproject
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

? What do you want to do? Generate Angular2 SDK
? For which application do you want to build an SDK? (Use arrow keys)
❯ webapp
? What SDK features do you want to include?
 (*) Enable PubSub + IO + FireLoop functionality
>(*) Add default values in models
? Do you want to generate ONLY FireLoop SDK + Auth Services? (Y/n)
````

It is important to note that you should [create an application] by using the [FireLoop] CLI Tool prior this procedure.

Also, when you create new [FireLoop] Models, you may want to rebuild the SDK for any of your client applications using the same procedure we just followed.

Note that the [FireLoop] option will only be presented if IO is enabled.

[FireLoop]: http://fireloop.io
[create an application]: https://github.com/mean-expert-official/fireloop.io/wiki/Creating-Client-Applications
