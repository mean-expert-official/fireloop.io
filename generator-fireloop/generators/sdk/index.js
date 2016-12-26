"use strict";
var path = require('path');
var yosay = require('yosay');
var generators = require('yeoman-generator');
var chalk = require("chalk");
module.exports = generators.Base.extend({
    prompting: function () {
        var keys = {
            IO: 'Enable PubSub + IO + FireLoop functionality',
            FIRELOOP: 'Generate ONLY FireLoop SDK + Auth Services',
            DEFAULT_VALUES: 'Add default values in models'
        };
        var choices = [keys.IO, keys.DEFAULT_VALUES];
        var selected = {
            IO: true,
            FIRELOOP: true,
            DEFAULT_VALUES: false
        };
        if (!this.options.showOptions) {
            this.log(chalk.green("IO: " + selected.IO));
            this.log(chalk.green("FIRELOOP: " + selected.FIRELOOP));
            this.log(chalk.green("DEFAULT_VALUES: " + selected.DEFAULT_VALUES));
            this.spawnCommand('node_modules/.bin/lb-sdk', [
                this.options.serverPath || 'server/server',
                path.join('../', this.options.clientPath || 'webapp/src/app/shared/sdk'),
                '-d', !this.options.clientType || this.options.clientType.match(/(ng2web|ng2ionic)/)
                    ? 'ng2web'
                    : this.options.clientType.trim(),
                '-w', 'enabled',
                '-i', selected.IO ? 'enabled' : 'disabled',
                '-f', selected.FIRELOOP ? 'enabled' : 'disabled',
                '-v', selected.DEFAULT_VALUES ? 'enabled' : 'disabled'
            ], {
                shell: true,
                cwd: this.destinationPath('fireloop')
            });
        }
        else {
            return this.prompt([{
                    type: 'checkbox',
                    name: 'list',
                    message: 'What SDK features do you want to include?',
                    default: 0,
                    choices: choices
                }]).then(function (answers) {
                answers.list.forEach(function (answer) {
                    if (answer === keys.IO) {
                        selected.IO = true;
                    }
                    else if (answer === keys.DEFAULT_VALUES) {
                        selected.DEFAULT_VALUES = true;
                    }
                });
                if (selected.IO) {
                    this.prompt([{
                            type: 'confirm',
                            name: 'fl',
                            message: 'Do you want to generate FireLoop SDK + Auth Services?'
                        }]).then(function (answers) {
                        selected.FIRELOOP = answers.fl;
                        this.log(chalk.green("IO: " + selected.IO));
                        this.log(chalk.green("FIRELOOP: " + selected.FIRELOOP));
                        this.log(chalk.green("DEFAULT_VALUES: " + selected.DEFAULT_VALUES));
                        this.spawnCommand('node_modules/.bin/lb-sdk', [
                            this.options.serverPath || 'server/server',
                            path.join('../', this.options.clientPath || 'webapp/src/app/shared/sdk'),
                            '-d', !this.options.clientType || this.options.clientType.match(/(ng2web|ng2ionic)/)
                                ? 'ng2web'
                                : this.options.clientType.trim(),
                            '-w', 'enabled',
                            '-i', selected.IO ? 'enabled' : 'disabled',
                            '-f', selected.FIRELOOP ? 'enabled' : 'disabled',
                            '-v', selected.DEFAULT_VALUES ? 'enabled' : 'disabled'
                        ], {
                            shell: true,
                            cwd: this.destinationPath('fireloop')
                        });
                    }.bind(this));
                }
                else {
                    this.log(chalk.green("IO: " + selected.IO));
                    this.log(chalk.green("FIRELOOP: " + selected.FIRELOOP));
                    this.log(chalk.green("DEFAULT_VALUES: " + selected.DEFAULT_VALUES));
                    this.spawnCommand('node_modules/.bin/lb-sdk', [
                        this.options.serverPath || 'server/server',
                        path.join('../', this.options.clientPath || 'webapp/src/app/shared/sdk'),
                        '-d', !this.options.clientType || this.options.clientType.match(/(ng2web|ng2ionic)/)
                            ? 'ng2web'
                            : this.options.clientType.trim(),
                        '-w', 'enabled',
                        '-i', selected.IO ? 'enabled' : 'disabled',
                        '-f', selected.FIRELOOP ? 'enabled' : 'disabled',
                        '-v', selected.DEFAULT_VALUES ? 'enabled' : 'disabled'
                    ], {
                        shell: true,
                        cwd: this.destinationPath('fireloop')
                    });
                }
            }.bind(this));
        }
    }
});
//# sourceMappingURL=../../src/src/sdk/index.js.map