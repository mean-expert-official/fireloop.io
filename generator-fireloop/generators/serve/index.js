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
    /**
     * @module fireloop:serve
     * @author Brannon N. Darby II <gh:brannon-darby>
     */
    constructor: function () {
        generators.apply(this, arguments);
        this.log(yosay('Let\'s serve an application!'));
    },
    prompting: function () {
        var clients = this.config.get('clients') || {};
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
            this.clients = clients;
        }.bind(this));
    },
    writing: function () {
        var _this = this;
        var spawns = {
            concurrently: {
                cmd: "" + require.resolve('concurrently').replace(/\b(concurrently[(\/)(\\\\)]src[(\/)(\\\\)]main.js)\b/g, '.bin/concurrently'),
                argv: ['']
            },
            server: {
                cmd: require.resolve('nodemon').replace(/\b(nodemon[(\/)(\\\\)]lib[(\/)(\\\\)]nodemon.js)\b/g, '.bin/nodemon'),
                argv: ['.']
            },
            ng2web: {
                cmd: require.resolve('@angular/cli').replace(/(@angular[(\/)(\\\\)]cli[(\/)(\\\\)]lib[(\/)(\\\\)]cli[(\/)(\\\\)]index.js)/g, '.bin/ng'),
                argv: ['serve']
            }
        };
        var clientsToServe = this.selected.map(function (answer) {
            var client = _this.clients[answer];
            var spawn = spawns[client.type];
            spawn.cwd = _this.destinationPath(client.path);
            if (!spawn.cmd) {
                _this.log(chalk.red("Oops " + client.type + " is not yet implemented, try by running nativescript or ionic commands within your client app."));
            }
            return {
                name: answer,
                type: (client.type === 'server') ? 'Server' : 'Client',
                cmd: spawn.cmd,
                argv: spawn.argv,
                opt: {
                    cwd: spawn.cwd,
                    detached: true,
                }
            };
        });
        clientsToServe.forEach(function (client) {
            _this.log(chalk.green("\tLoading " + client.type + " Application: " + client.name));
            _this.spawnCommand(client.cmd, client.argv, client.opt)
                .on('exit', function (code) {
                _this.log(chalk.green("\t--- " + client.name + " exit success ---"));
                _this.log(chalk.green("\texit code: " + code));
            });
        });
    }
});
//# sourceMappingURL=/Volumes/HD710M/development/www/mean.expert/@mean-expert/fireloop.io/generator-fireloop/src/serve/index.js.map