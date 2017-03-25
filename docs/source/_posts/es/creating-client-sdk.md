---
title: Creando el SDK para el Cliente
lenguage: es
---

La integración [FireLoop] se construye en el SDK, por lo que sólo necesita generar uno e instalarlo mediante la herramienta CLI.

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

Es importante tener en cuenta que debe [crear una aplicación] utilizando la herramienta [FireLoop] CLI antes de este procedimiento.

Además, al crear nuevos modelos [FireLoop], puede que desee reconstruir el SDK para cualquiera de sus aplicaciones cliente siguiendo el mismo procedimiento que seguimos.

Tenga en cuenta que la opción [FireLoop] sólo se presentará si IO está habilitada.

[FireLoop]: http://fireloop.io
[create an application]: https://github.com/mean-expert-official/fireloop.io/wiki/Creating-Client-Applications
