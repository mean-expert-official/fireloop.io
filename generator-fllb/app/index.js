// Copyright IBM Corp. 2014,2016. All Rights Reserved.
// Node module: generator-loopback
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

var path = require('path');
var g = require('../lib/globalize');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var workspace = require('loopback-workspace');
var Workspace = workspace.models.Workspace;

var fs = require('fs');

var actions = require('../lib/actions');
var helpers = require('../lib/helpers');
var helpText = require('../lib/help');
var validateAppName = helpers.validateAppName;
var pkg = require('../package.json');

module.exports = yeoman.Base.extend({
  constructor: function() {
    yeoman.Base.apply(this, arguments);

    this.argument('name', {
      desc: g.f('Name of the application to scaffold.'),
      required: false,
      type: String,
    });

    this.option('skip-install', {
      desc: g.f('Do not install npm dependencies.'),
      type: Boolean,
    });

    this.option('skip-next-steps', {
      desc: g.f('Do not print "next steps" info'),
      type: Boolean,
    });

    this.option('explorer', {
      desc: g.f('Add {{Loopback Explorer}} to the project ({{true}} ' +
        'by default)'),
      type: Boolean,
    });
  },

  /*
  greet: function() {
    this.log(yosay(g.f('Let\'s create a {{LoopBack}} application!')));
  },
  */

  help: function() {
    var msgs = [helpText.customHelp(this, 'loopback_app_usage.txt')];

    var list = Object.keys(this.options.env.getGeneratorsMeta())
      .filter(function(name) {
        return name.indexOf('loopback:') !== -1;
      });
    if (helpers.getCommandName() === 'loopback-cli') {
      list = list.map(name => name.replace(/^loopback:/, 'lb '));
      msgs.push(g.f('\nAvailable commands:\n\n'));
    } else {
      msgs.push(g.f('\nAvailable generators:\n\n'));
    }

    msgs.push(list.map(it => '  ' + it).join('\n'));
    return msgs.join('') + '\n';
  },

  injectWorkspaceCopyRecursive: function() {
    var originalMethod = Workspace.copyRecursive;
    Workspace.copyRecursive = function(src, dest, cb) {
      var isDir = fs.statSync(src).isDirectory();
      if (isDir) {
        this.directory(src, dest);
      } else {
        this.copy(src, dest);
      }
      process.nextTick(cb);
    }.bind(this);

    // Restore the original method when done
    this.on('end', function() {
      Workspace.copyRecursive = originalMethod;
    });
  },

  loadTemplates: function() {
    var done = this.async();

    Workspace.describeAvailableTemplates(function(err, list) {
      if (err) return done(err);
      this.templates = list.map(function(t) {
        return {
          name: g.f('%s (%s)', t.name, t.description),
          value: t.name,
          supportedLBVersions: t.supportedLBVersions,
        };
      });

      // TODO(bajtos) generator-loopback should not be coupled with APIC
      // See also https://github.com/strongloop/generator-loopback/issues/139
      if (helpers.getCommandName() === 'apic') {
        this.defaultTemplate = 'hello-world';
        this.templates = this.templates.filter(function(t) {
          return t.value !== 'api-server';
        });
      } else {
        this.defaultTemplate = 'api-server';
      }
      done();
    }.bind(this));
  },


  askForProjectName: function() {
    /*
    if (this.options.nested && this.name) {
      this.appname = this.name;
      return;
    }

    // https://github.com/strongloop/generator-loopback/issues/38
    // yeoman-generator normalize the appname with ' '
    this.appname =
      path.basename(process.cwd()).replace(/[\/@\s\+%:\.]+?/g, '-');

    var name = this.name || this.dir || this.appname;

    var prompts = [
      {
        name: 'appname',
        message: g.f('What\'s the name of your application?'),
        default: name,
        validate: validateAppName,
      },
    ];

    return this.prompt(prompts).then(function(props) {
      this.appname = props.appname || this.appname;
    }.bind(this));
    */
    this.appname = this.name
  },

  configureDestinationDir: actions.configureDestinationDir,

  fetchLoopBackVersions: function() {
    var done = this.async();
    var self = this;
    Workspace.getAvailableLBVersions(function(err, versionsMap) {
      if (err) return done(err);
      var versionNames = Object.keys(versionsMap);
      self.availableLBVersions = versionNames.map(function(version) {
        return {
          name: version + ' (' + versionsMap[version].description + ')',
          value: version,
        };
      });
      done();
    });
  },

  askForLBVersion: function() {
    var prompts = [{
      name: 'loopbackVersion',
      message: g.f('Which version of {{LoopBack}} would you like to use?'),
      type: 'list',
      default: '3.x',
      choices: this.availableLBVersions,
    }];

    var self = this;
    return this.prompt(prompts).then(function(answers) {
      self.options.loopbackVersion = answers.loopbackVersion;
    }.bind(this));
  },

  applyFilterOnTemplate: function() {
    var LBVersion = this.options.loopbackVersion;
    var templates = this.templates;

    this.templates = templates.filter(function(t) {
      return t.supportedLBVersions.indexOf(LBVersion) !== -1;
    });
  },

  askForTemplate: function() {
    var prompts = [{
      name: 'wsTemplate',
      message: g.f('What kind of application do you have in mind?'),
      type: 'list',
      default: this.defaultTemplate,
      choices: this.templates,
    }];

    var self = this;
    return this.prompt(prompts).then(function(answers) {
      // Do NOT use name template as it's a method in the base class
      self.wsTemplate = answers.wsTemplate;
    }.bind(this));
  },

  initWorkspace: actions.initWorkspace,

  detectExistingProject: function() {
    var cb = this.async();
    Workspace.isValidDir(function(err) {
      if (err) {
        cb();
      } else {
        cb(new Error(g.f('The generator must be run in an empty directory.')));
      }
    });
  },

  project: function() {
    var done = this.async();

    Workspace.createFromTemplate(
      this.wsTemplate,
      this.appname,
      {
        'loopbackVersion': this.options.loopbackVersion,
        'loopback-component-explorer': this.options.explorer !== false,
      },
      done
    );
  },

  copyFiles: function() {
    this.directory('.', '.');
  },

  generateYoRc: function() {
    this.log(g.f('Generating {{.yo-rc.json}}'));
    this.config.save();
  },

  installing: actions.installDeps,

  end: {
    printNextSteps: function() {
      if (this.options.skipNextSteps) return;

      var cmd = helpers.getCommandName();
      if (!this._skipInstall) {
        this.log();
        this.log();
      }

      this.log(g.f('Next steps:'));
      this.log();
      if (this.dir && this.dir !== '.') {
        this.log(g.f('  Change directory to your app'));
        this.log(chalk.green('    $ cd ' + this.dir));
        this.log();
      }
      if (cmd === 'apic') {
        this.log(g.f('  Run {{API Designer}} to create, test, ' +
          ' and publish your application'));
        this.log(chalk.green('    $ apic edit'));
        this.log();
      } else {
        this.log(g.f('  Create a model in your app'));
        if (cmd === 'loopback-cli')
          this.log(chalk.green('    $ lb model'));
        else
          this.log(chalk.green('    $ ' + cmd + ' loopback:model'));
        this.log();
        this.log(g.f('  Run the app'));
        this.log(chalk.green('    $ node .'));
        this.log();
      }
    },

    promotion: function() {
      var cmd = helpers.getCommandName();
      if (cmd !== 'loopback-cli') return;
      if (this.options.skipNextSteps) {
        this.log();
      }

      this.log(chalk.blue(g.f(
        'The API Connect team at IBM happily continues to develop,\n' +
          'support and maintain LoopBack, which is at the core of\n' +
          'API Connect. When your APIs need robust management and\n' +
          'security options, please check out %s',
        'http://ibm.biz/tryAPIC')));
      this.log();
    },
  },
});

// Export it for strong-cli to use
module.exports._package = pkg.name + ': ' + pkg.version;
module.exports._yeoman = yeoman;
