"use strict";
var yosay = require('yosay');
var fs = require('fs');
var path = require('path');
var generators = require('yeoman-generator');
var chalk = require('chalk');
var ejs = require('ejs');
/**
 * @module Angular 2 [FireLoop]
 * @author Jonathan Casarrubias <t: johncasarrubias, gh:mean-expert-official>
 * @description
 * This module generates and configure a FireLoop Server
 */
module.exports = generators.extend({
    prompting: function () {
        this.options.clients = this.config.get('clients') || {};
        var done = this.async();
        return this.prompt([{
                type: 'input',
                name: 'name',
                message: 'What\'s the name of your application?',
                default: 'webapp'
            }]).then(function (answers) {
            var _this = this;
            if (this.options.clients[answers.name]) {
                this.log(chalk.red("\n\nThere is already an application using the name " + answers.name));
                done();
            }
            else {
                this.log(chalk.green("\n\nCreating new Angular 2 Application: " + answers.name));
                var nmdir = require.resolve('@angular/cli').replace(/@angular(\/|\\)cli(\/|\\)lib(\/|\\)cli(\/|\\)index.js/, '');
                var clicmd = path.join(nmdir, '.bin/ng');
                var args = ['new', answers.name];
                if (answers.universal) {
                    args.push('--universal');
                }
                this.spawnCommand(clicmd, ['new', answers.name], { shell: true })
                    .on('exit', function (code) {
                    if (code === 0) {
                        _this.options.current = answers.name;
                        _this.options.clients[answers.name] = {
                            path: "./" + answers.name,
                            type: 'ng2web'
                        };
                        _this.config.set('clients', _this.options.clients);
                    }
                    else {
                        _this.log(chalk.green("\nApplication Status Code: " + code + "\n"));
                    }
                    done();
                });
            }
        }.bind(this));
    },
    buildsdk: function () {
        if (this.options.current) {
            this.composeWith('fireloop:sdk', {
                options: {
                    clientPath: path.join(this.options.clients[this.options.current].path, 'src/app/shared/sdk'),
                    serverPath: this.options.serverPath
                }
            });
        }
    },
    install: function () {
        var dest = this.destinationPath(this.options.current);
        if (this.options.current) {
            this.spawnCommand("npm", ['install', '--save', 'socket.io-client'], {
                cwd: dest
            });
            this.spawnCommand("npm", ['install', '--save-dev', '@types/socket.io-client'], {
                cwd: dest
            });
        }
        else {
            this.log(chalk.red("\nUnable to install socket io lib: " + this.options.current + "\n"));
        }
    },
    copyTemplates: function () {
        var _this = this;
        if (this.options.current) {
            [
                {
                    template: 'templates/web/app.module.ts',
                    output: this.options.current + "/src/app/app.module.ts",
                    params: {}
                },
                {
                    template: 'templates/web/tsconfig.json',
                    output: this.options.current + "/src/tsconfig.json",
                    params: {}
                },
                {
                    template: 'templates/web/typings.d.ts',
                    output: this.options.current + "/src/typings.d.ts",
                    params: {}
                }
            ].forEach(function (config) {
                console.info('Generating: %s', "" + config.output);
                // Not Using this.fs because asking the user for these replacements
                // Is not needed.
                fs.writeFileSync(_this.destinationPath(config.output), ejs.render(fs.readFileSync(require.resolve(__dirname + "/../../" + config.template), { encoding: 'utf-8' }), config.params));
            });
        }
    }
});
//# sourceMappingURL=/Volumes/HD710M/development/www/mean.expert/@mean-expert/fireloop.io/generator-fireloop/src/ng2web/index.js.map