// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: generator-loopback
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

var path = require('path');
var g = require('../lib/globalize');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var util = require('util');

var actions = require('../lib/actions');
var helpers = require('../lib/helpers');
var helpText = require('../lib/help');
var validateRequiredName = helpers.validateRequiredName;
var validateOptionalName = helpers.validateOptionalName;
var validateRemoteMethodName = helpers.validateRemoteMethodName;
var typeChoices = helpers.getTypeChoices();
var ModelDefinition = require('loopback-workspace').models.ModelDefinition;

module.exports = yeoman.Base.extend({
  // This generator does not track file changes via yeoman,
  // as loopback-workspace is editing (modifying) files when
  // saving project changes.
  constructor: function() {
    yeoman.Base.apply(this, arguments);

    this.argument('modelName', {
      desc: g.f('Name of the model'),
      required: false,
      type: String,
    });

    this.argument('methodName', {
      desc: g.f('Name of the remote method'),
      required: false,
      type: String,
    });
  },

  help: function() {
    return helpText.customHelp(this, 'loopback_remote-method_usage.txt');
  },

  loadProject: actions.loadProject,

  loadModels: actions.loadModels,

  askForModel: function() {
    if (this.modelName) {
      this.modelDefinition = this.projectModels.filter(function(m) {
        return m.name === this.modelName;
      }.bind(this))[0];

      if (!this.modelDefinition) {
        var msg = g.f('Model not found: %s' +
                  '. Please choose from Model List:', this.modelName);
        this.log(chalk.red(msg));
      }
    }

    if (!this.modelDefinition) {
      var prompts = [
        {
          name: 'model',
          message: g.f('Select the model:'),
          type: 'list',
          choices: this.editableModelNames,
        },
      ];
      return  this.prompt(prompts).then(function(answers) {
        this.modelName = answers.model;
      }.bind(this));
    }
  },

  findModelDefinition: function() {
    this.modelDefinition = this.projectModels.filter(function(m) {
      return m.name === this.modelName;
    }.bind(this))[0];

    if (!this.modelDefinition) {
      var msg = g.f('Model not found: %s', this.modelName);
      this.log(chalk.red(msg));
      this.async()(new Error(msg));
    }
  },

  askForParameters: function() {
    var name = this.methodName;
    var prompts = [
      {
        name: 'methodName',
        message: g.f('Enter the remote method name:'),
        required: true,
        default: name,
        validate: validateRemoteMethodName,
      },
      {
        name: 'isStatic',
        message: g.f('Is Static?'),
        required: false,
        type: 'confirm',
        default: function(answers) {
          return !answers.methodName.match(/^prototype\.(.*)$/);
        },
      },
      {
        name: 'description',
        message: g.f('Description for method:'),
      },
    ];
    return this.prompt(prompts).then(function(answers) {
      var m = answers.methodName.match(/^prototype\.(.*)$/);
      var isStatic = !m;
      var baseName = isStatic ? answers.methodName : m[1];
      this.methodName = baseName;
      this.isStatic = answers.isStatic;
      this.description = answers.description;
    }.bind(this));
  },

  delimEndpoints: function() {
    this.log();
    this.log(g.f('Let\'s configure where to expose your new method ' +
      'in the public REST API.'));
    this.log(g.f('You can provide multiple HTTP endpoints, enter an empty ' +
      'path when you are done.'));
    this.http = [];
  },

  askForEndpoints: function() {
    var done = this.async();

    var prompts = [
      {
        name: 'httpPath',
        message: g.f('Enter the path of this endpoint:'),
        required: true,
      },
    ];
    return this.prompt(prompts).then(function(answers) {
      if (answers.httpPath == null || answers.httpPath === '') {
        return done();
      }
      var subprompts = [
        {
          name: 'httpVerb',
          message: g.f('HTTP verb:'),
          type: 'list',
          choices: [
            {name: g.f('post'), value: 'post'},
            {name: g.f('put'), value: 'put'},
            {name: g.f('delete'), value: 'delete'},
            {name: g.f('get'), value: 'get'},
            {name: g.f('(other)'), value: null},
          ],
        },
        {
          name: 'customHttpVerb',
          message:
          g.f('Enter the custom http verb'),
          validate: validateRequiredName,
          when: function(answers) {
            return answers.httpVerb === null;
          },
        },
      ];

      var httpPath = answers.httpPath;

      return this.prompt(subprompts).then(function(answers) {
        this.http.push({
          path: httpPath,
          verb: answers.httpVerb || answers.customHttpVerb,
        });
        this.log(g.f(
          '\nLet\'s add another endpoint, enter an empty name when done.'));
        this.askForEndpoints();
      }.bind(this));
    }.bind(this));
  },

  delimAccepts: function() {
    this.log();
    this.log(g.f('Describe the input ("accepts") arguments of your remote ' +
      'method.'));
    this.log(g.f('You can define multiple input arguments.'));
    this.log(g.f('Enter an empty name when you\'ve defined all input ' +
      'arguments.'));

    this.accepts = [];
  },

  askForAccepts: function() {
    var done = this.async();

    var prompts = [
      {
        name: 'acceptsArg',
        message: g.f('What is the name of this argument?'),
        required: true,
        validate: validateOptionalName,
      },
    ];
    return this.prompt(prompts).then(function(answers) {
      if (answers.acceptsArg == null || answers.acceptsArg === '') {
        return done();
      }
      var subprompts = [
        {
          name: 'acceptsType',
          message: g.f('Select argument\'s type:'),
          type: 'list',
          choices: typeChoices,
        },
        {
          name: 'acceptsRequired',
          message: g.f('Is this argument required?'),
          type: 'confirm',
          default: false,
        },
        {
          name: 'acceptsDes',
          message: g.f('Please describe the argument:'),
          required: true,
        },
        {
          name: 'httpSource',
          message: g.f('Where to get the value from?'),
          type: 'list',
          choices: [
            {
              name: g.f('(auto)'),
              value: null,
            },
            {
              name: g.f('form'),
              value: 'form',
            },
            {
              name: g.f('path'),
              value: 'path',
            },
            {
              name: g.f('query'),
              value: 'query',
            },
            {
              name: g.f('store the whole request body'),
              value: 'body',
            },
            {
              name: g.f('store the full request object'),
              value: 'req',
            },
            {
              name: g.f('store the full response object'),
              value: 'res',
            },
            {
              name: g.f('store the whole context object'),
              value: 'context',
            },
          ],
        },
      ];

      var argName = answers.acceptsArg;

      return this.prompt(subprompts).then(function(answers) {
        var entry = {
          arg: argName,
          type: answers.acceptsType,
          required: answers.acceptsRequired,
          description: answers.acceptsDes,
        };
        if (answers.httpSource) {
          entry.http = {source: answers.httpSource};
        }
        this.accepts.push(entry);
        this.log(g.f('\nLet\'s add another accept argument, ' +
          'enter an empty name when done.'));
        this.askForAccepts();
      }.bind(this));
    }.bind(this));
  },

  delimReturns: function() {
    this.log();
    this.log(g.f('Describe the output ("returns") arguments ' +
     'to the remote method\'s callback function.'));
    this.log(g.f('You can define multiple output arguments.'));
    this.log(g.f('Enter an empty name when you\'ve defined all output ' +
      'arguments.'));
    this.returns = [];
  },

  askForReturns: function() {
    var done = this.async();

    var prompts = [
      {
        name: 'returnsArg',
        message: g.f('What is the name of this argument?'),
        required: true,
        validate: validateOptionalName,
      },
    ];
    return this.prompt(prompts).then(function(answers) {
      if (answers.returnsArg == null || answers.returnsArg === '') {
        return done();
      }
      var subprompts = [
        {
          name: 'returnsType',
          message: g.f('Select argument\'s type:'),
          type: 'list',
          choices: typeChoices,
        },
        {
          name: 'returnsRoot',
          message: g.f('Is this argument a full response body (root)?'),
          type: 'confirm',
          default: false,
        },
        {
          name: 'returnsDes',
          message: g.f('Please describe the argument:'),
          required: true,
        },
      ];

      var argName = answers.returnsArg;

      return this.prompt(subprompts).then(function(answers) {
        this.returns.push({
          arg: argName,
          type: answers.returnsType,
          root: answers.returnsRoot,
          description: answers.returnsDes,
        });
        this.log(g.f(
          '\nLet\'s add another return argument. Enter empty name when done.'));
        this.askForReturns();
      }.bind(this));
    }.bind(this));
  },

  remote: function() {
    var done = this.async();
    var def = {
      name: this.methodName,
      isStatic: this.isStatic,
      description: this.description,
      accepts: this.accepts,
      returns: this.returns,
      http: this.http,
    };

    this.modelDefinition.methods.create(def, function(err) {
      helpers.reportValidationError(err, this.log);
      return done(err);
    }.bind(this));
  },

  printSampleRemoteMethodSource: function() {
    // print an empty line as a visual delimiter
    this.log();

    var text = [
      buildIntroduction(this),
      buildJsdoc(this),
      buildMethodSource(this),
    ].join('\n\n');
    this.log(text);

    // print an empty line as a visual delimiter
    this.log();
  },

  saveProject: actions.saveProject,
});

function buildIntroduction(def) {
  var modelDef = def.modelDefinition;
  var projectRoot = def.destinationRoot();
  var jsonFilePath = ModelDefinition.getPath(modelDef.facetName, modelDef);
  var jsFilePath = modelDef.getScriptPath();
  jsFilePath = path.relative(projectRoot, jsFilePath);
  jsFilePath = chalk.yellow(jsFilePath);
  jsonFilePath = chalk.yellow(jsonFilePath);

  var tip = [
    g.f(
      'We added {{strong-remoting}} metadata for your new method to %s.',
      jsonFilePath
    ),
    g.f(
      'You must implement the method in %s. For example:',
      jsFilePath
    ),
    g.f('Here is sample code to get you started:'),
  ].join('\n');

  return tip;
}

function buildJsdoc(def) {
  var jsdocLines =  [
    '/**',
    util.format(' * %s', def.description),
  ];

  jsdocLines = jsdocLines.concat(buildInputJsdoc(def.accepts));
  jsdocLines = jsdocLines.concat(buildReturnsJsdoc(def.returns));

  jsdocLines.push(' */');
  return jsdocLines.join('\n');
}

function buildMethodSource(def) {
  var ref = util.format(
    '%s%s%s',
    def.modelName,
    (def.isStatic ? '.' : '.prototype.'),
    def.methodName
  );
  var functionDef = [util.format(
    ref + ' = function(%s) {',
    chalk.green(buildInputArgs(def.accepts).join(', '))
    ),
  ];

  if (def.returns.length > 0)
    functionDef.push(buildReturnDeclare(def.returns));

  functionDef.push('  // TODO');
  functionDef.push('  ' + buildCallback(def.returns));
  functionDef.push('};');

  return functionDef.join('\n');
}

function buildInputJsdoc(accepts) {
  var acceptJsdoc = accepts.map(function(accept) {
    return util.format(
      ' * \@param {%s} %s %s',
      accept.type,
      chalk.green(accept.arg),
      accept.description
    );
  });

  return acceptJsdoc;
}

function buildReturnsJsdoc(returns) {
  var returnTypes = ['Error'].concat(returns.map(function(_return) {
    return _return.type;
  })).join(', ');
  var returnDef = util.format(
    ' * \@param {Function(%s)} callback',
    chalk.green(returnTypes)
  );
  return returnDef;
}

function buildInputArgs(accepts) {
  var acceptArg = accepts.map(function(accept) {
    return accept.arg;
  });
  acceptArg.push('callback');
  return acceptArg;
}

function buildReturnDeclare(returns) {
  var returnArgs = buildReturnArgs(returns);
  returnArgs.shift();
  var returnDef = util.format(
    '  var %s;',
    chalk.green(returnArgs.join(', '))
  );
  return returnDef;
}

function buildCallback(returns) {
  var callbackLine = util.format(
    'callback(%s);',
    chalk.green(buildReturnArgs(returns).join(', '))
  );
  return callbackLine;
}

function buildReturnArgs(returns) {
  var returnArg = ['null'].concat(returns.map(function(_return) {
    return _return.arg;
  }));
  return returnArg;
}
