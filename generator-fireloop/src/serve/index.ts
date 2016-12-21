declare var module: any;
declare var require: any;
var yosay      = require('yosay');
var path       = require('path');
var generators = require('yeoman-generator');
import * as chalk from 'chalk';
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

    let clients: any   = this.config.get('clients') || {};
        clients.server = {  path: './fireloop', type: 'server' };

    let choices: string[] = Object.keys(clients || []);

    let spawns: any = {
      server: {
        cmd  : path.join(require.resolve('nodemon').replace(/nodemon(\/|\\)lib(\/|\\)nodemon.js/, ''), '.bin/nodemon')
      },
      web: {
        cmd  : path.join(require.resolve('angular-cli').replace(/angular-cli(\/|\\)lib(\/|\\)cli(\/|\\)index.js/, ''), '.bin/ng'),
        argv : ['serve']
      }
    }

    return this.prompt([{
      type    : 'checkbox',
      name    : 'list',
      message : 'What application do you want to serve?',
      default : 0,
      choices : choices
    }]).then(function (answers: { list: string[] }) {
      answers.list.forEach((answer: string) => {
        let client = clients[answer];
        let spawn  = spawns[client.type];
        let type   = client.type === 'server' ? 'Server' : 'Client';
        this.log(chalk.green(`\tLoading ${ type } Application: ${ answer }`));
        this.log(chalk.green(spawn.cmd));
        this.log(chalk.green(spawn.argv));
        this.spawnCommand(spawn.cmd, spawn.argv, { shell: true, cwd: path.normalize(client.path) })
          .on('exit', (code: number) => {
            this.log(chalk.green(`\n\n${ type } Application Closed: ${answer}`));
          });
      });
    }.bind(this));
  }
});