"use strict";
var yosay = require('yosay');
var path = require('path');
var generators = require('yeoman-generator');
var chalk = require('chalk');
/**
 * @module FireLoopGenerator [FireLoop]
 * @author Jonathan Casarrubias <t: johncasarrubias, gh:mean-expert-official>
 * @description
 * This module generates and configure a FireLoop Server
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
        var spawns = {
            server: {
                cmd: path.join(require.resolve('nodemon').replace(/nodemon(\/|\\)lib(\/|\\)nodemon.js/, ''), '.bin/nodemon')
            },
            ng2web: {
                cmd: path.join(require.resolve('@angular/cli').replace(/@angular(\/|\\)cli(\/|\\)lib(\/|\\)cli(\/|\\)index.js/, ''), '.bin/ng'),
                argv: ['serve']
            }
        };
        return this.prompt([{
                type: 'checkbox',
                name: 'list',
                message: 'What application do you want to serve?',
                default: 0,
                choices: choices
            }]).then(function (answers) {
            var _this = this;
            answers.list.forEach(function (answer) {
                var client = clients[answer];
                var spawn = spawns[client.type];
                var type = client.type === 'server' ? 'Server' : 'Client';
                if (!spawn.cmd) {
                    _this.log(chalk.red("Oops " + type + " is not yet implemented, try by running nativescript or ionic commands within your client app."));
                }
                _this.log(chalk.green("\tLoading " + type + " Application: " + answer));
                _this.spawnCommand(spawn.cmd, spawn.argv, { shell: true, cwd: path.normalize(client.path) })
                    .on('exit', function (code) {
                    _this.log(chalk.green("\n\n" + type + " Application Closed: " + answer));
                });
            });
        }.bind(this));
    }
});
//# sourceMappingURL=/Volumes/HD710M/development/www/mean.expert/@mean-expert/fireloop.io/generator-fireloop/src/serve/index.js.map