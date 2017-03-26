// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: generator-loopback
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

var g = require('../lib/globalize');
var chalk = require('chalk');
var yeoman = require('yeoman-generator');

var wsModels = require('loopback-workspace').models;

var actions = require('../lib/actions');
var helpers = require('../lib/helpers');
var helpText = require('../lib/help');
var validateRequiredName = helpers.validateRequiredName;

function toNumberedList(items) {
  var lastIndex = items.length - 1;
  return items.map(function(item, index) {
    var name = item;
    if (index !== lastIndex) {
      // Last item should not be numbered
      name = (index + 1) + '. ' + item;
    }
    return {
      name: name,
      value: item,
    };
  });
}

var OTHER_PHASE = '(custom phase)';
var LAST_PHASE = '(last phase)';

module.exports = yeoman.Base.extend({
  // This generator does not track file changes via yeoman,
  // as loopback-workspace is editing (modifying) files when
  // saving project changes.

  loadProject: actions.loadProject,

  constructor: function() {
    yeoman.Base.apply(this, arguments);

    this.argument('name', {
      desc: g.f('Name of the middleware to create.'),
      required: false,
      type: String,
    });
  },

  help: function() {
    return helpText.customHelp(this, 'loopback_middleware_usage.txt');
  },

  loadPhases: function() {
    var done = this.async();
    wsModels.Middleware.getPhases(function(err, list) {
      if (err) {
        return done(err);
      }

      this.phases = list.map(function(m) {
        return m.phase;
      });

      done();
    }.bind(this));
  },

  askForName: function() {
    var prompts = [
      {
        name: 'name',
        message: g.f('Enter the middleware name:'),
        default: this.name,
        validate: validateRequiredName,
      },
    ];

    return this.prompt(prompts).then(function(props) {
      this.name = props.name;
    }.bind(this));
  },

  askForPhase: function() {
    var displayName = chalk.yellow(this.name);

    var prompts = [
      {
        name: 'phase',
        message: g.f('Select the phase for %s:', displayName),
        type: 'list',
        default: 'routes',
        choices: toNumberedList(this.phases.concat([OTHER_PHASE])),
      },
      {
        name: 'customPhase',
        message: g.f('Enter the phase name:'),
        validate: validateRequiredName,
        when: function(answers) {
          return answers.phase === OTHER_PHASE;
        },
      },
      {
        name: 'nextPhase',
        message: g.f('Select the phase before which the new one will ' +
          'be inserted:'),
        type: 'list',
        default: 'routes',
        choices: toNumberedList(this.phases.concat([LAST_PHASE])),
        when: function(answers) {
          return answers.phase === OTHER_PHASE;
        },
      },
      {
        name: 'subPhase',
        message: g.f('Select the sub phase for %s:', displayName),
        type: 'list',
        default: '',
        choices: [
          {name: g.f('1. before'), value: 'before'},
          {name: g.f('2. regular'), value: ''},
          {name: g.f('3. after'), value: 'after'},
        ],
      },
    ];

    return this.prompt(prompts).then(function(props) {
      this.phase = props.customPhase || props.phase;
      this.customPhase = props.customPhase;
      this.nextPhase = props.nextPhase;
      this.subPhase = props.subPhase;
    }.bind(this));
  },

  promptForPaths: function() {
    var displayName = chalk.yellow(this.name);
    this.log(g.f('Specify paths for %s:', displayName));
  },

  askForPaths: function() {
    var done = this.async();
    this.log(g.f('Enter an empty path name when done.'));
    var prompts = [
      {
        name: 'path',
        message: g.f('Path uri:'),
        validate: function(input) {
          if (input) {
            if (input.indexOf('/') !== 0) {
              return g.f('Path must start with /');
            } else {
              return true;
            }
          } else {
            return true;
          }
        },
      },
    ];
    return this.prompt(prompts).then(function(answers) {
      if (answers.path == null || answers.path === '') {
        return done();
      }

      this.paths = this.paths || [];
      this.paths.push(answers.path);
      this.log(g.f('Let\'s add another path.'));
      this.askForPaths();
    }.bind(this));
  },

  askForParams: function() {
    var prompts = [
      {
        name: 'params',
        message: g.f('Configuration parameters in {{JSON}} format:'),
        default: '{}',
        validate: function(input) {
          if (input) {
            try {
              JSON.parse(input);
            } catch (err) {
              return err;
            }
            return true;
          } else {
            return true;
          }
        },
      },
    ];
    return this.prompt(prompts).then(function(answers) {
      this.params = JSON.parse(answers.params);
    }.bind(this));
  },

  middleware: function() {
    var done = this.async();
    var config = {
      name: this.name,
      phase: this.phase,
      subPhase: this.subPhase,
      paths: this.paths,
      params: this.params || {},
      facetName: 'server', // hard-coded for now
    };

    var self = this;

    if (self.customPhase && self.nextPhase) {
      if (self.nextPhase === LAST_PHASE) {
        self.nextPhase = null;
        config.nextPhase = self.nextPhase;
      } else {
        config.nextPhase = self.nextPhase;
      }
    }

    wsModels.Middleware.addMiddleware(config, function(err, inst) {
      helpers.reportValidationError(err, self.log);
      if (!err && inst) {
        self.log(g.f(
          'Middleware %s is added to phase %s.', inst.name, inst.phase));
      }
      return done(err);
    });
  },

  saveProject: actions.saveProject,
});
