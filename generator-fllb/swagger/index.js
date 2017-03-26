// Copyright IBM Corp. 2014,2016. All Rights Reserved.
// Node module: generator-loopback
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

var g = require('../lib/globalize');
var url = require('url');
var chalk = require('chalk');
var yeoman = require('yeoman-generator');
var loadSwaggerSpecs = require('./spec-loader');

var workspace = require('loopback-workspace');
var wsModels = workspace.models;

var actions = require('../lib/actions');
var helpers = require('../lib/helpers');
var helpText = require('../lib/help');

var fs = require('fs');
var async = require('async');

// A list of flags to control whether a model should be generated
var NOT_SELECTED = 0; // It's not selected
var CONFLICT_DETECTED = -1; // A model with the same name exists
var SELECTED_FOR_UPDATE = 1; // Selected for update
var SELECTED_FOR_CREATE = 2; // Selected for create

module.exports = yeoman.Base.extend({
  // NOTE(bajtos)
  // This generator does not track file changes via yeoman,
  // as loopback-workspace is editing (modifying) files when
  // saving project changes.

  constructor: function() {
    yeoman.Base.apply(this, arguments);

    this.argument('url', {
      desc: g.f('URL of the swagger spec.'),
      required: false,
      type: String,
    });
  },

  help: function() {
    return helpText.customHelp(this, 'loopback_swagger_usage.txt');
  },

  loadProject: actions.loadProject,

  loadDataSources: actions.loadDataSources,
  addNullDataSourceItem: actions.addNullDataSourceItem,

  askForSpecUrlOrPath: function() {
    var prompts = [
      {
        name: 'url',
        message: g.f('Enter the swagger spec url or file path:'),
        default: this.url,
        validate: validateUrlOrFile,
      },
    ];
    return this.prompt(prompts).then(function(answers) {
      this.url = answers.url.trim();
    }.bind(this));
  },

  swagger: function() {
    var self = this;
    var done = this.async();
    loadSwaggerSpecs(this.url, this.log, function(err, apis) {
      if (err) {
        done(err);
      } else {
        self.apis = apis;
        done();
      }
    });
  },

  checkModels: function() {
    var self = this;
    var done = this.async();

    this.modelDefs = [];
    this.modelConfigs = [];
    this.modelNames = [];

    var api, i, n;
    for (i = 0, n = self.apis.length; i < n; i++) {
      api = self.apis[i];
      var basePath = api.spec.resourcePath || api.spec.basePath || 'api';
      if (basePath.indexOf('/') === 0) {
        basePath = basePath.substring(1);
      }
    }

    // eslint-disable-next-line one-var
    var m;
    for (i = 0, n = self.apis.length; i < n; i++) {
      api = self.apis[i];
      for (m in api.models) {
        var model = api.models[m];
        if (model.type && model.type !== 'object') {
          // Only handle model of object type (not array or simple types)
          continue;
        }
        self.modelNames.push(m);
        self.modelDefs.push({
          name: model.name,
          plural: model.plural,
          base: model.base || 'PersistedModel',
          facetName: 'common', // hard-coded for now
          properties: model.properties,
        });
        var tags = api.spec.tags || [];
        var found = tags.some(function(t) {
          return t.name === m;
        });
        self.modelConfigs.push({
          name: model.name,
          facetName: 'server', // hard-coded for now
          public: found,
        });
      }
    }

    this.selectedModels = {};
    this.modelNames.forEach(function(m) {
      self.selectedModels[m] = NOT_SELECTED;
    });

    async.parallel([
      function(done) {
          // Find existing model definitions
        wsModels.ModelDefinition.find(
            {where: {name: {inq: self.modelNames}}}, done);
      },
      function(done) {
        wsModels.ModelConfig.find(
            {where: {name: {inq: self.modelNames}}}, done);
      }],
      function(err, objs) {
        if (err) {
          helpers.reportValidationError(err, self.log);
          return done(err);
        }

        objs[0].forEach(function(d) {
          self.selectedModels[d.name] = CONFLICT_DETECTED;
        });

        objs[1].forEach(function(c) {
          self.selectedModels[c.name] = CONFLICT_DETECTED;
        });

        var choices = Object.keys(self.selectedModels).map(function(m) {
          var flag = self.selectedModels[m];
          return {
            name: m + ((flag === CONFLICT_DETECTED) ? ' (!)' : ''),
            modelName: m,
            flag: flag,
            checked: flag !== CONFLICT_DETECTED, // force users to decide
          };
        });

        var prompts = [
          {
            name: 'modelSelections',
            message: g.f('Select models to be generated:'),
            type: 'checkbox',
            choices: choices,
          },
          {
            name: 'dataSource',
            message: g.f('Select the data-source to attach models to:'),
            type: 'list',
            default: self.defaultDataSource,
            choices: self.dataSources,
          },
        ];
        return self.prompt(prompts).then(function(answers) {
          self.dataSource = answers.dataSource;
          answers.modelSelections.forEach(function(m) {
            for (var i = 0, n = choices.length; i < n; i++) {
              var c = choices[i];
              if (c.name === m) {
                self.selectedModels[c.modelName] =
                  (c.flag === CONFLICT_DETECTED ?
                    SELECTED_FOR_UPDATE : SELECTED_FOR_CREATE);
                break;
              }
            }
          });
          done();
        });
      });
  },

  generateApis: function() {
    var self = this;
    var found = false;
    for (var m in this.selectedModels) {
      if (this.selectedModels[m] === SELECTED_FOR_UPDATE ||
        this.selectedModels[m] === SELECTED_FOR_CREATE) {
        found = true;
        break;
      }
    }
    if (!found) {
      return;
    }
    var done = this.async();

    function createModel(self, modelDef, cb) {
      function processResult(err, result) {
        if (err) {
          return cb(err);
        }
        if (result) {
          modelDef.scriptPath = result.getScriptPath();
        }
        var propertyNames = Object.keys(modelDef.properties);
        if (propertyNames.length > 0) {
          result.properties.destroyAll(function(err) {
            if (err) {
              return cb(err);
            }
            // 2. Create model properties one by one
            async.eachSeries(propertyNames,
              function(m, done) {
                modelDef.properties[m].name = m;
                // FIXME: [rfeng] Can we automate the inheritance of facetName?
                modelDef.properties[m].facetName = result.facetName;
                result.properties.create(modelDef.properties[m],
                  function(err) {
                    return done(err);
                  });
              }, function(err) {
                if (!err) {
                  self.log(chalk.green(g.f('Model definition created/updated ' +
                  'for %s.', modelDef.name)));
                }
                cb(err);
              });
          });
        } else {
          self.log(chalk.green(g.f('Model definition created/updated for %s.',
            modelDef.name)));
          cb();
        }
      }

      if (self.selectedModels[modelDef.name] === SELECTED_FOR_UPDATE) {
        self.log(chalk.green(g.f('Updating model definition for %s...',
          modelDef.name)));
        modelDef.id = wsModels.ModelDefinition.getUniqueId(modelDef);
        // update the model definition
        wsModels.ModelDefinition.upsert(modelDef, processResult);
      } else if (self.selectedModels[modelDef.name] === SELECTED_FOR_CREATE) {
        self.log(chalk.green(g.f('Creating model definition for %s...',
          modelDef.name)));
        wsModels.ModelDefinition.create(modelDef, processResult);
      } else {
        // Skip
        process.nextTick(cb);
      }
    }

    function createModelConfig(self, config, cb) {
      if (config.dataSource === undefined) {
        config.dataSource = self.dataSource;
      }
      if (self.selectedModels[config.name] === SELECTED_FOR_UPDATE) {
        self.log(chalk.green(g.f('Updating model config for %s...',
          config.name)));
        config.id = wsModels.ModelDefinition.getUniqueId(config);
        wsModels.ModelConfig.upsert(config, function(err) {
          if (!err) {
            self.log(chalk.green(g.f('Model config updated for %s.',
              config.name)));
          }
          return cb(err);
        });
      } else if (self.selectedModels[config.name] === SELECTED_FOR_CREATE) {
        self.log(chalk.green(g.f('Creating model config for %s...',
          config.name)));
        wsModels.ModelConfig.create(config, function(err) {
          if (!err) {
            self.log(chalk.green(g.f('Model config created for %s.',
              config.name)));
          }
          return cb(err);
        });
      } else {
        // Skip
        process.nextTick(cb);
      }
    }

    function generateRemoteMethods(self, cb) {
      var apis = self.apis;
      async.eachSeries(apis, function(api, done) {
        async.forEachOf(api.code, function(code, m, done) {
          if (self.selectedModels[m] !== SELECTED_FOR_UPDATE &&
            self.selectedModels[m] !== SELECTED_FOR_CREATE) {
            return done();
          }
          var modelDef = api.modelDefinition;
          for (var i = 0, n = self.modelDefs.length; i < n; i++) {
            if (m === self.modelDefs[i].name) {
              modelDef = self.modelDefs[i];
              break;
            }
          }
          if (!modelDef) {
            return done();
          }
          self.log(chalk.green(g.f('Generating %s', modelDef.scriptPath)));
          fs.writeFile(modelDef.scriptPath, code, done);
        }, done);
      }, cb);
    }

    function generateApis(self, cb) {
      async.series([
        // Create model definitions
        function(done) {
          async.each(self.modelDefs, function(def, cb) {
            createModel(self, def, cb);
          }, done);
        },
        // Create model configurations
        function(done) {
          async.each(self.modelConfigs, function(config, cb) {
            createModelConfig(self, config, cb);
          }, done);
        },
        function(done) {
          generateRemoteMethods(self, done);
        },
      ], cb);
    }

    generateApis(self, function(err) {
      if (!err) {
        self.log(
          chalk.green(g.f('Models are successfully generated from ' +
            '{{swagger spec}}.')));
      }
      helpers.reportValidationError(err, self.log);
      done(err);
    });
  },

  saveProject: actions.saveProject,
});

function validateUrlOrFile(specUrlStr) {
  if (!specUrlStr) {
    return g.f('spec url or file path is required');
  }
  var specUrl = url.parse(specUrlStr);
  if (specUrl.protocol === 'http:' || specUrl.protocol === 'https:') {
    return true;
  } else {
    var stat = fs.existsSync(specUrlStr) && fs.statSync(specUrlStr);
    if (stat && stat.isFile()) {
      return true;
    } else {
      return g.f('file path %s is not a file.', specUrlStr);
    }
  }
}
