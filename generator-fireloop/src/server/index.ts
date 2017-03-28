declare var module: any;
declare var require: any;
var generators = require('yeoman-generator');
var mkdirp = require('mkdirp');
var rmdir = require('rimraf');
var fs = require('fs');
var ejs = require('ejs');
import * as chalk from 'chalk';
import * as path from 'path';
/**
 * @module ServerGenerator [FireLoop]
 * @author Jonathan Casarrubias <t: johncasarrubias, gh:mean-expert-official>
 * @description
 * This module generates and configure a FireLoop Server
 */
module.exports = generators.extend({
  // The name `constructor` is important here
  constructor: function() {
    // Calling the super constructor is important so our generator is correctly set up
    generators.apply(this, arguments);
    this.log(chalk.yellow('\nSetting up new FireLoop environment.\n'));
  },

  prompting: function() {
    return this.prompt([{
      type: 'input',
      name: 'name',
      message: 'Your project name',
      default: this.appname
    }]).then(function(answers: { name: string }) {
      this.appname = answers.name && answers.name !== '' ? answers.name : 'fireloop';
    }.bind(this));
  },
  
  // Not reinventing the wheel, let LoopBack Generator to build the Base.
  installBase: function () {
    this.composeWith(require.resolve('generator-fllb'),
      { name: this.appname, skipNextSteps: true }
    );
  },

  install: function() {
    this.npmInstall([
      '@mean-expert/loopback-component-realtime',
      '@mean-expert/loopback-stats-mixin',
      '@mean-expert/model',
      '@mean-expert/boot-script',
      '@mean-expert/loopback-sdk-builder',
      'ts-node',
      'typescript',
      '@types/node',
      '@types/mocha',
      'loopback-ds-timestamp-mixin',
      'cookie-parser',
      'chai',
      'mocha',
      'supertest',
      'cookie-parser'
    ], { 'save': true });
  },
  end: function() {
    var _this = this;
    rmdir.sync(this.destinationPath('client'));
    rmdir.sync(this.destinationPath('server/boot/root.js'));
    rmdir.sync(this.destinationPath('server/boot/authentication.js'));
    mkdirp(this.destinationPath('tests'));
    [
      {
        template: 'templates/fireloop/component-config.json',
        output: { directory: 'server', file: 'component-config.json' },
        params: {}
      },
      {
        template: 'templates/fireloop/server.js',
        output: { directory: 'server', file: 'server.js' },
        params: {}
      },
      {
        template: 'templates/fireloop/model-config.json',
        output: { directory: 'server', file: 'model-config.json' },
        params: {}
      },
      {
        template: 'templates/fireloop/testing.ts',
        output: { directory: 'server/boot', file: 'testing.ts' },
        params: {}
      },
      {
        template: 'templates/fireloop/root.ts',
        output: { directory: 'server/boot', file: 'root.ts' },
        params: {}
      },
      {
        template: 'templates/fireloop/authentication.ts',
        output: { directory: 'server/boot', file: 'authentication.ts' },
        params: {}
      },
      {
        template: 'templates/fireloop/nodemon.json',
        output: { directory: './', file: 'nodemon.json' },
        params: {}
      },
      {
        template: 'templates/fireloop/tsconfig.json',
        output: { directory: './', file: 'tsconfig.json' },
        params: {}
      },
      {
        template: 'templates/tests/keepme.txt',
        output: { directory: 'tests', file: '.keepme' },
        params: {}
      },
      {
        template: 'templates/fireloop/app.json',
        output: { directory: '../', file: 'app.json' },
        params: {}
      },
      {
        template: 'templates/fireloop/Procfile',
        output: { directory: '../', file: 'Procfile' },
        params: {}
      },
      {
        template: 'templates/fireloop/package.json',
        output: { directory: '../', file: 'package.json' },
        params: { appname: this.appname.toLowerCase().replace(/\s/, '-') }
      }
    ].forEach(function(config: any) {
      console.info('Generating: %s', "" + config.output.file);
      var _cwd = _this.destinationPath(config.output.directory);
      // TODO: Decouple and polish the code in below
      try {
        fs.accessSync(_cwd, fs.F_OK);
        generate(_cwd, config);
      }
      catch (e) {
        mkdirp(_cwd);
        generate(_cwd, config);
      }
    });
    this.composeWith('fireloop:jsonupdate', {
      filePath: this.destinationPath('package.json'),
      replace: {
        scripts: {
          lint: 'eslint .',
          start: 'node server/server.js',
          posttest: 'npm run lint && nsp check',
          test: 'NODE_ENV=testing npm run start'
        }
      }
    });

    let apiName: string = this.destinationPath().split(path.sep).pop();

    this.config.set('clients', {
      [apiName]: {
        path: `./${ apiName }`,
        type: 'server'
      }
    });

    if (this.options.skipNextSteps)
      return;
    this.log('\nNext steps:\n');
    this.log('\tCreate a model in your server');
    this.log(chalk.green('\t\t$ fireloop model [ModelName]\n'));
    this.log('\tCreate a new Angular 2 Client or SDK');
    this.log(chalk.green('\t\t$ fireloop\n'));
    this.log('\tServe an application');
    this.log(chalk.green('\t\t$ fireloop serve\n'));
  },
});

function generate(cwd: any, config: any) {
  fs.writeFileSync(
    path.join(cwd, config.output.file),
    ejs.render(
      fs.readFileSync(
        path.join(__dirname, '..', '..', config.template),
        { encoding: 'utf-8' }),
      config.params
    )
  );
}
