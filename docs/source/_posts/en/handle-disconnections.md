---
title: Handle Disconnections
Comments:  to to false
---

![FireLoop.io](https://storage.googleapis.com/mean-expert-images/fireloop-logo.png)

## Handle Disconnections

Sometimes when a user is disconnected from the server, some business rules required to be applied. For example if your program is a chat application, you might want to show to others when a user disconnects.

`NOTE: Functionality available on loopback-component-realtime@1.0.0-rc.6 or above`

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