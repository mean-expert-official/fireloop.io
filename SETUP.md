How to locally setup FireLoop
==============

If you want to start contributing or just because you want to have FireLoop installed locally, then you will need to read the following steps:

## Clone FireLoop Repo
First of all you need to clone the FireLoop repository from GitHub.

````sh
$ git clone git@github.com:mean-expert-official/fireloop.io.git
````

## FireLoop CLI
The FireLoop CLI is a gateway that acts as an interface for the final user, though it uses a couple of yeoman generators to work on the actual scaffolding.

Since the FireLoop CLI is for users public entrance, you will require to `npm link` this specific project locally running.

> IMPORTANT: Make sure you globally uninstall previous versions of fireloop `$ npm uninstall -g @mean-expert/fireloop`

````sh
$ cd fireloop.io/fireloop-cli
$ npm install 
$ npm link
````

The commands described above will install local copy of the FireLoop CLI running from the code you just cloned.

Any change you make within the fireloop-cli code, will be immediately reflected within the command line interface functionality.

## FireLoop Generator
The FireLoop Generator is a yeoman generator that actually coordinates the setup of the project, sdk generations and it provides with the templates that transforms a regular LoopBack application into a FireLoop Application.

The FireLoop Generator is written in TypeScript, the source code can be located within the `generator-fireloop/src` directory.

When changes are made within the `generator-fireloop` source code and in order to test it, the very first thing you need to do is to compile the project:

````sh
$ cd fireloop.io/generator-fireloop/src
$ tsc
````

The commands described above will generate the JavaScript code into the `fireloop.io/generator-fireloop/generators` directory.

Now, in order for the local FireLoop client to use your code you will need install the code you just generated as follows:


````sh
$ cd fireloop.io/fireloop-cli
$ npm install ../generator-fireloop
````

Don't use the --save or --save-dev flags because we don't want to persist the local reference into the package.json.

After you install the compiled code into the FireLoop CLI you should be able see your modifications by using the fireloop command

````sh
$ fireloop
````