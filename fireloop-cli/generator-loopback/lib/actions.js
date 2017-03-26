// Copyright IBM Corp. 2014,2016. All Rights Reserved.
// Node module: generator-loopback
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

var path = require('path');
var g = require('strong-globalize')();
var fs = require('fs');
var workspace = require('loopback-workspace');
var Workspace = workspace.models.Workspace;

var actions = exports;

// All actions defined in this file should be called with `this` pointing
// to a generator instance

/**
 * Decide where to create the project, possibly asking the user,
 * and set the generator environment so that everything is generated
 * in the target directory.
 */
actions.configureDestinationDir = function() {
  var self = this;
  if (this.options.nested && this.options.projectDir) {
    // no-op when called from `yo loopback:example`
    return;
  }

  if (this.appname === path.basename(this.destinationRoot())) {
    // When the project name is the same as the current directory,
    // we are assuming the user has already created the project dir
    return;
  }

  var done = this.async();
  return this.prompt([
    {
      name: 'dir',
      message: g.f('Enter name of the directory to contain the API Server:'),
      default: 'fireloop'
    },
  ]).then(function(answers) {
    var dir = answers.dir;
    self.dir = dir;
    if (!dir || dir === '.') return done();

    var root = path.join(this.destinationRoot(), dir);
    if (!fs.existsSync(root)) {
      this.log.create(dir + '/');
      fs.mkdirSync(root);
    }
    this.destinationRoot(root);
    this.log.info(g.f('change the working directory to %s', dir));
    this.log();
    done();
  }.bind(this));
};

/**
 * Initialize the workspace to use the destination root as WORKSPACE_DIR.
 */
actions.initWorkspace = function() {
  if (this.options.nested && this.options.projectDir) {
    this._externalProject = true;
    this.projectDir = this.options.projectDir;
    return true;
  }

  this.projectDir = this.destinationRoot();
  process.env.WORKSPACE_DIR = this.projectDir;

  return false;
};

/**
 * Load the project in `this.destinationRoot()`.
 * Set `this.projectDir`.
 * @async
 */
actions.loadProject = function() {
  if (actions.initWorkspace.call(this))
    return;

  var done = this.async();
  Workspace.isValidDir(done);
};

/**
 * Save the current project, update all project files.
 */
actions.saveProject = function() {
  if (this._externalProject) {
    return;
  }

  // no-op in workspace 3.0
};

/**
 * Load all models of the current project.
 * `this.projectModels` will contain an array of all models (Array.<Model>)
 * `this.modelNames` will contain an array of names (Array.<string>)
 * `this.editableModels` will contain an array of models without read-only
 * models (Array.<Model>)
 * `this.editableModelNames` will contain an array of names (Array.<string>)
 */
actions.loadModels = function() {
  var done = this.async();
  workspace.models.ModelDefinition.find(function(err, results) {
    if (err) return done(err);
    this.projectModels = results;
    this.modelNames = results.map(function(m) {
      return m.name;
    });
    this.editableModels = results.filter(function(result) {
      return !result.readonly;
    });
    this.editableModelNames = this.editableModels.map(function(m) {
      return m.name;
    });
    done();
  }.bind(this));
};

/**
 * Install npm dependencies, unless the option "skip-install" is enabled.
 *
 * Note that this action only schedules the install step to the task queue,
 * the actual installation is invoked later as part of the "installing" phase.
 */
actions.installDeps = function() {
  // yeoman-generator 0.20.x checks this.options.skipInstall
  this.options.skipInstall = this.options['skip-install'];

  this.installDependencies({
    npm: true,
    bower: false,
  });
};

/**
 * Load all data sources of the current project
 * `this.dataSources` will contain an array of data sources
 */
actions.loadDataSources = function() {
  var self = this;
  var done = self.async();

  workspace.models.DataSourceDefinition.find(function(err, results) {
    if (err) {
      return done(err);
    }
    self.dataSources = results.map(function(ds) {
      return {
        name: ds.name + ' (' + ds.connector + ')',
        value: ds.name,
        _connector: ds.connector,
      };
    });

    self.hasDatasources = self.dataSources && self.dataSources.length > 0;

    // Use 'db' as the default datasource if it exists
    var defaultDS = null;
    if (self.hasDatasources) {
      var found = self.dataSources.some(function(ds) {
        return ds.value === 'db';
      });
      if (found) {
        defaultDS = 'db';
      } else {
        // default to 1st one
        defaultDS = self.dataSources[0].value;
      }
    }
    self.defaultDataSource = defaultDS;
    done();
  });
};

/**
 * Modify the list of datasources created by {@link loadDataSources}
 * and append an item for `null` datasource.
 */
actions.addNullDataSourceItem = function() {
  this.dataSources.push({
    name: '(no data-source)',
    value: null,
  });
};
