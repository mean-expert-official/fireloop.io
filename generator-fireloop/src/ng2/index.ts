declare var module: any;
declare var require: any;
declare var __dirname: any;
var yosay = require('yosay');
var generators = require('yeoman-generator');
var commandExist = require('command-exists');
import * as chalk from 'chalk';
import * as async from 'async';
interface ClientInterface { name: string, path?: string };
/**
 * @module Angular 2 [FireLoop]
 * @author Jonathan Casarrubias <t: johncasarrubias, gh:mean-expert-official>
 * @description
 * This module generates and configure a FireLoop Server
 */
module.exports = generators.extend({

  prompting: function() {

    let keys: { ANGULAR_WEB: string, ANGULAR_UNIVERSAL: string, ANGULAR_NATIVE: string, ANGULAR_IONIC: string } = {
      ANGULAR_WEB: 'Angular 2 for Web',
      ANGULAR_UNIVERSAL: 'Angular 2 Universal (Experimental)',
      ANGULAR_NATIVE: 'Angular 2 {N}ative',
      ANGULAR_IONIC: 'Angular 2 Ionic'
    };

    let choises: string[] = [keys.ANGULAR_WEB, keys.ANGULAR_UNIVERSAL];

    return async.parallel([
      (next: Function) => commandExist('tns', (err: any, exist: boolean) => {
        if (exist) {
          choises.push(keys.ANGULAR_NATIVE);
        } else {
          this.log(chalk.yellow('Enable NativeScript 2 Support:'));
          this.log(chalk.yellow('$ npm install -g nativescript'));
        }
        next(err);
      }),
      (next: Function) => commandExist('ionic', (err: any, exist: boolean) => {
        if (exist) {
          choises.push(keys.ANGULAR_IONIC);
        } else {
          this.log(chalk.yellow('Enable Ionic 2 Support:'));
          this.log(chalk.yellow('$ npm install -g cordova ionic'));
        }
        next(err);
      })
    ], (err) => {
      // UI
      return this.prompt([{
        type: 'list',
        name: 'selected',
        message: 'What type of Angular 2 Application do you want to create?',
        default: 0,
        choices: choises
      }]).then(function(answers: { selected: any }) {
        let done = this.async();
        switch (answers.selected) {
          default:
          case keys.ANGULAR_WEB:
            this.composeWith('fireloop:ng2web').on('end', () => done());
            break;
          case keys.ANGULAR_UNIVERSAL:
            this.composeWith('fireloop:ng2universal').on('end', () => done());
            break;
          case keys.ANGULAR_NATIVE:
            this.composeWith('fireloop:ng2native').on('end', () => done());
            break;
          case keys.ANGULAR_IONIC:
            this.composeWith('fireloop:ng2ionic').on('end', () => done());
            break;
        }
      }.bind(this));
    });
  }
});
