---
title: Sirviendo Aplicaciones
lenguage: es 
---
![FireLoop.io](https://storage.googleapis.com/mean-expert-images/fireloop-logo.png)

[FireLoop] es capaz de ejecutar todas las aplicaciones de su proyecto a la vez (incluyendo su servidor), para esto puede usar el comando `fireloop serve` y seleccionar las aplicaciones que desea servir.

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

Es importante tener en cuenta que tanto las aplicaciones de cliente como de servidor se ejecutarán en [TypeScript] y se cargarán con mecanismos livereload según el entorno.

Esto significa que una vez que sus aplicaciones se estén ejecutando, éstas serán reiniciadas por cualquier modificación de código y recompiladas para ser recargadas en vivo.

[TypeScript]: http://typescriptlang.org
[FireLoop]: http://fireloop.io
[create an application]: https://github.com/mean-expert-official/fireloop.io/wiki/Creating-Client-Applications