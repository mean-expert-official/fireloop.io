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
module.exports = generators.Base.extend({
    constructor: function () {
        generators.Base.apply(this, arguments);
        this.log(yosay('Let\'s serve an application!'));
    },
    prompting: function () {
        var clients = this.config.get('clients') || {};
        clients.server = { path: './fireloop', type: 'server' };
        var choices = Object.keys(clients || []);
        var spawns = {
            server: {
                cmd: path.join(require.resolve('nodemon').replace(/nodemon(\/|\\)lib(\/|\\)nodemon.js/, ''), '.bin/nodemon')
            },
            web: {
                cmd: path.join(require.resolve('angular-cli').replace(/angular-cli(\/|\\)lib(\/|\\)cli(\/|\\)index.js/, ''), '.bin/ng'),
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
                _this.log(chalk.green("\tLoading " + type + " Application: " + answer));
                _this.log(chalk.green(spawn.cmd));
                _this.log(chalk.green(spawn.argv));
                _this.spawnCommand(spawn.cmd, spawn.argv, { shell: true, cwd: path.normalize(client.path) })
                    .on('exit', function (code) {
                    _this.log(chalk.green("\n\n" + type + " Application Closed: " + answer));
                });
            });
        }.bind(this));
    }
});
//# sourceMappingURL=/Volumes/HD710M/development/www/mean.expert/@mean-expert/fireloop.io/generator-fireloop/src/serve/index.js.map