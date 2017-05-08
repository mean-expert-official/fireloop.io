"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var yosay = require('yosay');
var path = require('path');
var generators = require('yeoman-generator');
var chalk = require("chalk");
/**
 * @module FireLoopGenerator [FireLoop]
 * @author Jonathan Casarrubias <t: johncasarrubias, gh:mean-expert-official>
 * @description
 * This module generates and configures a FireLoop Server
 */
module.exports = generators.extend({
    constructor: function () {
        generators.apply(this, arguments);
        this.log(yosay('Let\'s serve an application!'));
    },
    prompting: function () {
        var clients = this.config.get('clients') || {};
        //clients.fireloop = { path: './fireloop', type: 'server' };
        var choices = Object.keys(clients || []);
        /**
         * TODO: Add user interface for those app clients that are mobile,
         * ask if wants to run IOS or Android
         */
        return this.prompt([{
                type: 'checkbox',
                name: 'list',
                message: 'What application do you want to serve?',
                default: choices,
                choices: choices
            }]).then(function (answers) {
            this.selected = answers.list;
        }.bind(this));
    },
    writing: function () {
        var _this = this;
        var clients = this.config.get('clients') || {};
        var spawns = {
            server: {
                cmd: path.join(require.resolve('nodemon').replace(/nodemon(\/|\\)lib(\/|\\)nodemon.js/, ''), '.bin/nodemon'),
                argv: ['.']
            },
            ng2web: {
                cmd: path.join(require.resolve('@angular/cli').replace(/@angular(\/|\\)cli(\/|\\)lib(\/|\\)cli(\/|\\)index.js/, ''), '.bin/ng'),
                argv: ['serve --progress false']
            }
        };
        var clientsToServe = [];
        this.selected.forEach(function (answer) {
            var client = clients[answer];
            var spawn = spawns[client.type];
            var type = client.type === 'server' ? 'Server' : 'Client';
            if (!spawn.cmd) {
                _this.log(chalk.red("Oops " + type + " is not yet implemented, try by running nativescript or ionic commands within your client app."));
            }
            _this.log(chalk.green("\tLoading " + type + " Application: " + answer));
            clientsToServe.push({ cmd: spawn.cmd, argv: spawn.argv, opt: { shell: true, cwd: _this.destinationPath(client.path) } });
        });
        var clientList = [];
        clientsToServe.forEach(function (client) {
            clientList.push("cd " + client.opt.cwd + "/ && " + client.cmd + " " + client.argv);
        });
        var concurrent = path.join(require.resolve('concurrently').replace(/concurrently(\/|\\)src(\/|\\)main.js/, ''), '.bin/concurrently');
        this.spawnCommand(concurrent, clientList);
    }
});
//# sourceMappingURL=C:/Users/bdarby/Desktop/fireloop.io/generator-fireloop/src/serve/index.js.map