declare var module: any;
declare var require: any;
var path = require('path');
var yosay = require('yosay');
var generators = require('yeoman-generator');
import * as chalk from 'chalk';
import * as async from 'async';

/**
 * @module Builder [FireLoop]
 * @author Jonathan Casarrubias <t: johncasarrubias, gh:mean-expert-official>
 * @description
 * This module generates and configures a FireLoop SDK
 */
module.exports = generators.extend({
  /**
   * @module fireloop:sdk
   * @author Brannon N. Darby II <gh:brannon-darby>
   */
  constructor: function() {
    generators.apply(this, arguments);
    this.log(yosay('Let\'s build an SDK!'));
  },

  prompting: function() {

    const sdkOptions: {
      IO: string;
      FIRELOOP_ONLY: string;
      NGRX: string;
      DEFAULT_VALUES: string;
    } = {
        IO: 'Enable PubSub + IO + FireLoop functionality',
        FIRELOOP_ONLY: 'Generate ONLY FireLoop SDK + Auth Services',
        NGRX: 'Enable NGRX functionality',
        DEFAULT_VALUES: 'Add default values in models'
      };

    const choices: string[] = [
      sdkOptions.IO,
      sdkOptions.FIRELOOP_ONLY,
      sdkOptions.NGRX,
      sdkOptions.DEFAULT_VALUES,
    ];

    const defaultSelected: string[] = [
      sdkOptions.IO,
    ];

    let selected = {};

    return this.prompt([{
      type: 'checkbox',
      name: 'list',
      message: 'What SDK features do you want to include?',
      default: defaultSelected,
      choices: choices
    }]).then(function(answers: { list: string[] }) {
      answers.list.forEach((answer: string) => {
        this.selected[answer] = true;
      })
    }.bind(this));
  },

  buildSDK: function() {

    this.options.clients = this.config.get('clients') || {};
    let serverPath: string;
    console.log('Searching for server path...');
    Object.keys(this.options.clients).forEach((name: string) => {
      if (this.options.clients[name].type === 'server') {
        serverPath = this.options.clients[name].path;
        console.log('Server path found: ', serverPath);
      }
    });

    this.spawnCommand(
      'node_modules/.bin/lb-sdk',
      [
        'server/server',
        path.join('../', this.options.clientPath || 'webapp/src/app/shared/sdk'),
        '-d', !this.options.clientType || this.options.clientType.match(/(ng2web|ng2ionic)/)
          ? 'ng2web'
          : this.options.clientType.trim(),
        '-w', 'enabled',
        '-i', this.selected[this.sdkOptions.IO] ? 'enabled' : 'disabled',
        '-f', this.selected[this.sdkOptions.FIRELOOP] ? 'enabled' : 'disabled',
        '-n', this.selected[this.sdkOptions.NGRX] ? 'enabled' : 'disabled',
        '-v', this.selected[this.sdkOptions.DEFAULT_VALUES] ? 'enabled' : 'disabled'
      ],
      {
        shell: true,
        cwd: this.destinationPath(serverPath)
      }
    );
  }
});
