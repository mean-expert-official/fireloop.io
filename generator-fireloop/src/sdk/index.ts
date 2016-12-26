declare var module: any;
declare var require: any;
var path = require('path');
var yosay = require('yosay');
var generators = require('yeoman-generator');
import * as chalk from 'chalk';
/**
 * @module Builder [FireLoop]
 * @author Jonathan Casarrubias <t: johncasarrubias, gh:mean-expert-official>
 * @description
 * This module generates and configure a FireLoop Server
 */
module.exports = generators.Base.extend({
  /**
   * @method prompting
   * @author Brannon N. Darby II <gh:ng-logic>
   * @description
   * If this.options.showOptions = false, build SDK with default options
   * Otherwise, prompt user with options and use selections when building SDK
   */
  prompting: function() {
    let keys: { IO: string, FIRELOOP: string, DEFAULT_VALUES: string } = {
      IO: 'Enable PubSub + IO + FireLoop functionality',
      FIRELOOP: 'Generate ONLY FireLoop SDK + Auth Services',
      DEFAULT_VALUES: 'Add default values in models'
    };
    let choices: string[] = [keys.IO, keys.DEFAULT_VALUES];
    let selected: { IO: boolean, FIRELOOP: boolean, DEFAULT_VALUES: boolean } = {
      IO: true,
      FIRELOOP: true,
      DEFAULT_VALUES: false
    };
    if (!this.options.showOptions) {
      this.log(chalk.green(`IO: ${selected.IO}`));
      this.log(chalk.green(`FIRELOOP: ${selected.FIRELOOP}`));
      this.log(chalk.green(`DEFAULT_VALUES: ${selected.DEFAULT_VALUES}`));
      this.spawnCommand(
        'node_modules/.bin/lb-sdk',
        [
          this.options.serverPath || 'server/server',
          path.join('../', this.options.clientPath || 'webapp/src/app/shared/sdk'),
          '-d', !this.options.clientType || this.options.clientType.match(/(ng2web|ng2ionic)/)
            ? 'ng2web'
            : this.options.clientType.trim(),
          '-w', 'enabled',
          '-i', selected.IO ? 'enabled' : 'disabled',
          '-f', selected.FIRELOOP ? 'enabled' : 'disabled',
          '-v', selected.DEFAULT_VALUES ? 'enabled' : 'disabled'
        ],
        {
          shell: true,
          cwd: this.destinationPath('fireloop')
        }
      );
    } else {
      return this.prompt([{
        type: 'checkbox',
        name: 'list',
        message: 'What SDK features do you want to include?',
        default: 0,
        choices: choices
      }]).then(function(answers: { list: string[] }) {
        answers.list.forEach((answer: string) => {
          if (answer === keys.IO) {
            selected.IO = true;
          } else if (answer === keys.DEFAULT_VALUES) {
            selected.DEFAULT_VALUES = true;
          }
        });
        if (selected.IO) {
          this.prompt([{
            type: 'confirm',
            name: 'fl',
            message: 'Do you want to generate FireLoop SDK + Auth Services?'
          }]).then(function(answers: { fl: boolean }) {
            selected.FIRELOOP = answers.fl;
            this.log(chalk.green(`IO: ${selected.IO}`));
            this.log(chalk.green(`FIRELOOP: ${selected.FIRELOOP}`));
            this.log(chalk.green(`DEFAULT_VALUES: ${selected.DEFAULT_VALUES}`));
            this.spawnCommand(
              'node_modules/.bin/lb-sdk',
              [
                this.options.serverPath || 'server/server',
                path.join('../', this.options.clientPath || 'webapp/src/app/shared/sdk'),
                '-d', !this.options.clientType || this.options.clientType.match(/(ng2web|ng2ionic)/)
                  ? 'ng2web'
                  : this.options.clientType.trim(),
                '-w', 'enabled',
                '-i', selected.IO ? 'enabled' : 'disabled',
                '-f', selected.FIRELOOP ? 'enabled' : 'disabled',
                '-v', selected.DEFAULT_VALUES ? 'enabled' : 'disabled'
              ],
              {
                shell: true,
                cwd: this.destinationPath('fireloop')
              }
            );
          }.bind(this));
        } else {
          this.log(chalk.green(`IO: ${selected.IO}`));
          this.log(chalk.green(`FIRELOOP: ${selected.FIRELOOP}`));
          this.log(chalk.green(`DEFAULT_VALUES: ${selected.DEFAULT_VALUES}`));
          this.spawnCommand(
            'node_modules/.bin/lb-sdk',
            [
              this.options.serverPath || 'server/server',
              path.join('../', this.options.clientPath || 'webapp/src/app/shared/sdk'),
              '-d', !this.options.clientType || this.options.clientType.match(/(ng2web|ng2ionic)/)
                ? 'ng2web'
                : this.options.clientType.trim(),
              '-w', 'enabled',
              '-i', selected.IO ? 'enabled' : 'disabled',
              '-f', selected.FIRELOOP ? 'enabled' : 'disabled',
              '-v', selected.DEFAULT_VALUES ? 'enabled' : 'disabled'
            ],
            {
              shell: true,
              cwd: this.destinationPath('fireloop')
            }
          );
        }
      }.bind(this));
    }

  }
});
