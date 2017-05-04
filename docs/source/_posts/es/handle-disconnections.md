---
title: Manejar Desconecciones
Comments:  to to false
---

![FireLoop.io](https://storage.googleapis.com/mean-expert-images/fireloop-logo.png)

## Manejar Desconecciones

A veces, cuando se desconecta un usuario del servidor, es necesario aplicar algunas reglas. Por ejemplo, si su programa es una aplicación de chat, es posible que usted desee mostrar a otros usuarios cuando alguno se ha desconectado.

`NOTA: Funcionalidad disponible en loopback-component-realtime@1.0.0-rc.6 o superior`

````js
import { BootScript } from '@mean-expert/boot-script';

interface Account {
    id: string,
    connected: boolean;
    updateAttributes: Function;
}

interface Socket { token: { userId: string } }

@BootScript()
class OnDisconnect {

    constructor(public app: any) {
        app.on('socket-disconnect', (socket: Socket) => this.handler(socket));
    }

    handler(socket: Socket): void {
        if (socket.token && socket.token.userId) {
            let userId: string = `${ socket.token.userId }`
            this.app.models.Account.findById(userId, (err: Error, account: Account) => {
                console.log('A user has been disconnected:', account.id);
                account.updateAttributes({ connected: false  });
            });
        }
    }
}

module.exports = OnDisconnect;
````