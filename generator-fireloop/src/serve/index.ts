declare var module: any;
declare var require: any;
var yosay = require('yosay');
var path = require('path');
var generators = require('yeoman-generator');
import * as chalk from 'chalk';
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

  constructor: function() {
    generators.apply(this, arguments);
    this.log(yosay('Let\'s serve an application!'));
  },

  prompting: function() {

    let clients: any = this.config.get('clients') || {};
    //clients.fireloop = { path: './fireloop', type: 'server' };

    let choices: string[] = Object.keys(clients || []);

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
    }]).then(function(answers: { list: string[] }) {
      this.selected = answers.list;
    }.bind(this));
  },

  writing: function() {
    let clients: any = this.config.get('clients') || {};
    let spawns: any = {
      server: {
        cmd: path.join(require.resolve('nodemon').replace(/nodemon(\/|\\)lib(\/|\\)nodemon.js/, ''), '.bin/nodemon'),
        argv: ['.']
      },
      ng2web: {
        cmd: path.join(require.resolve('@angular/cli').replace(/@angular(\/|\\)cli(\/|\\)lib(\/|\\)cli(\/|\\)index.js/, ''), '.bin/ng'),
        argv: ['serve --progress false']
      }
    };
    let clientsToServe: { cmd: string, argv: Array<string>, opt: { shell: boolean, cwd: string } }[] = [];
    this.selected.forEach((answer: string) => {
      let client = clients[answer];
      let spawn = spawns[client.type];
      let type = client.type === 'server' ? 'Server' : 'Client';
      if (!spawn.cmd) {
        this.log(chalk.red(`Oops ${type} is not yet implemented, try by running nativescript or ionic commands within your client app.`));
      }
      this.log(chalk.green(`\tLoading ${type} Application: ${answer}`));
      clientsToServe.push({ cmd: spawn.cmd, argv: spawn.argv, opt: { shell: true, cwd: this.destinationPath(client.path) } });
    })
    let clientList: string[] = [];
    clientsToServe.forEach((client: { cmd: string, argv: Array<string>, opt: { shell: boolean, cwd: string } }) => {
      clientList.push(`cd ${client.opt.cwd}/ && ${client.cmd} ${client.argv}`);
    });
    let concurrent = path.join(require.resolve('concurrently').replace(/concurrently(\/|\\)src(\/|\\)main.js/, ''), '.bin/concurrently');
    this.spawnCommand(concurrent, clientList);
  }
});
