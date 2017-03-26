"use strict";
var yosay = require('yosay');
var generators = require('yeoman-generator');
var commandExist = require('command-exists');
var chalk = require('chalk');
var async = require('async');
;
/**
 * @module Angular 2 [FireLoop]
 * @author Jonathan Casarrubias <t: johncasarrubias, gh:mean-expert-official>
 * @description
 * This module generates and configure a FireLoop Server
 */
module.exports = generators.extend({
    prompting: function () {
        var _this = this;
        var keys = {
            ANGULAR_WEB: 'Angular 2 for Web',
            ANGULAR_UNIVERSAL: 'Angular 2 Universal (Experimental)',
            ANGULAR_NATIVE: 'Angular 2 {N}ative',
            ANGULAR_IONIC: 'Angular 2 Ionic'
        };
        var choises = [keys.ANGULAR_WEB, keys.ANGULAR_UNIVERSAL];
        return async.parallel([
            function (next) { return commandExist('tns', function (err, exist) {
                if (exist) {
                    choises.push(keys.ANGULAR_NATIVE);
                }
                else {
                    _this.log(chalk.yellow('Enable NativeScript 2 Support:'));
                    _this.log(chalk.yellow('$ npm install -g nativescript'));
                }
                next(err);
            }); },
            function (next) { return commandExist('ionic', function (err, exist) {
                if (exist) {
                    choises.push(keys.ANGULAR_IONIC);
                }
                else {
                    _this.log(chalk.yellow('Enable Ionic 2 Support:'));
                    _this.log(chalk.yellow('$ npm install -g cordova ionic'));
                }
                next(err);
            }); }
        ], function (err) {
            // UI
            return _this.prompt([{
                    type: 'list',
                    name: 'selected',
                    message: 'What type of Angular 2 Application do you want to create?',
                    default: 0,
                    choices: choises
                }]).then(function (answers) {
                var done = this.async();
                switch (answers.selected) {
                    default:
                    case keys.ANGULAR_WEB:
                        this.composeWith('fireloop:ng2web').on('end', function () { return done(); });
                        break;
                    case keys.ANGULAR_UNIVERSAL:
                        this.composeWith('fireloop:ng2universal').on('end', function () { return done(); });
                        break;
                    case keys.ANGULAR_NATIVE:
                        this.composeWith('fireloop:ng2native').on('end', function () { return done(); });
                        break;
                    case keys.ANGULAR_IONIC:
                        this.composeWith('fireloop:ng2ionic').on('end', function () { return done(); });
                        break;
                }
            }.bind(_this));
        });
    }
});
//# sourceMappingURL=/Volumes/HD710M/development/www/mean.expert/@mean-expert/fireloop.io/generator-fireloop/src/ng2/index.js.map