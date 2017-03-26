// Copyright IBM Corp. 2014,2016. All Rights Reserved.
// Node module: generator-loopback
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

/* global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-test');
var SANDBOX =  path.resolve(__dirname, 'sandbox');
var fs = require('fs');
var expect = require('chai').expect;
var wsModels = require('loopback-workspace').models;
var common = require('./common');
var workspace = require('loopback-workspace');
var Workspace = workspace.models.Workspace;

describe('loopback:model generator', function() {
  beforeEach(common.resetWorkspace);

  beforeEach(function createSandbox(done) {
    helpers.testDirectory(SANDBOX, done);
  });

  beforeEach(function createProject(done) {
    common.createDummyProject(SANDBOX, 'test-app', done);
  });

  beforeEach(function addRestDataSource(done) {
    wsModels.DataSourceDefinition.create({
      name: 'rest',
      connector: 'rest',
      facetName: 'server',
    }, done);
  });

  it('creates common/models/{name}.json', function(done) {
    var modelGen = givenModelGenerator();
    helpers.mockPrompt(modelGen, {
      name: 'Product',
      plural: 'pds',
      dataSource: 'db',
    });

    modelGen.run(function() {
      var content = readProductJsonSync();
      expect(content).to.have.property('name', 'Product');
      expect(content).to.not.have.property('public');
      expect(content).to.have.property('plural', 'pds');
      done();
    });
  });

  it('adds an entry to server/models.json', function(done) {
    var modelGen = givenModelGenerator();
    helpers.mockPrompt(modelGen, {
      name: 'Product',
      dataSource: 'db',
      public: false,
      propertyName: '',
    });

    var builtinModels = Object.keys(readModelsJsonSync('server'));
    modelGen.run(function() {
      var modelConfig = readModelsJsonSync('server');
      var newModels = Object.keys(modelConfig);
      var expectedModels = builtinModels.concat(['Product']);
      expect(newModels).to.have.members(expectedModels);
      expect(modelConfig.Product).to.eql({
        dataSource: 'db',
        public: false,
      });
      done();
    });
  });

  it('sets `base` option from the list', function(done) {
    var modelGen = givenModelGenerator();
    helpers.mockPrompt(modelGen, {
      name: 'Product',
      dataSource: 'db',
      base: 'PersistedModel',
    });

    modelGen.run(function() {
      var product = readProductJsonSync();
      expect(product).to.have.property('base', 'PersistedModel');
      done();
    });
  });

  it('sets `dataSource` option to db by default', function(done) {
    var modelGen = givenModelGenerator();
    helpers.mockPrompt(modelGen, {
      name: 'Product',
    });

    modelGen.run(function() {
      var product = readProductJsonSync();
      expect(product).to.have.property('base', 'PersistedModel');
      var modelConfig = readModelsJsonSync();
      expect(modelConfig.Product.dataSource).to.eql('db');
      done();
    });
  });

  it('sets custom `base` option', function(done) {
    var modelGen = givenModelGenerator();
    helpers.mockPrompt(modelGen, {
      name: 'Product',
      dataSource: 'rest',
      base: null,
      customBase: 'CustomModel',
    });

    modelGen.run(function() {
      var product = readProductJsonSync();
      expect(product).to.have.property('base', 'CustomModel');
      done();
    });
  });

  describe('in an empty project', function() {
    beforeEach(common.resetWorkspace);
    beforeEach(function createSandbox(done) {
      helpers.testDirectory(SANDBOX, done);
    });
    beforeEach(function(done) {
      process.env.WORKSPACE_DIR = SANDBOX;
      Workspace.createFromTemplate('empty-server', 'empty', done);
    });

    it('should set dataSource to null', function(done) {
      var modelGen = givenModelGenerator();
      helpers.mockPrompt(modelGen, {
        name: 'Product',
        plural: 'pds',
      });

      modelGen.run(function() {
        var modelConfig = readModelsJsonSync();
        expect(modelConfig.Product.dataSource).to.eql(null);
        var product = readProductJsonSync();
        expect(product).to.have.property('base', 'Model');
        done();
      });
    });

    it('should set dataSource to 1st one if db does not exist', function(done) {
      wsModels.DataSourceDefinition.create({
        name: 'db1',
        connector: 'memory',
        facetName: 'server',
      }, function(err) {
        if (err) return done(err);
        var modelGen = givenModelGenerator();
        helpers.mockPrompt(modelGen, {
          name: 'Review',
          plural: 'Reviews',
        });

        modelGen.run(function() {
          var modelConfig = readModelsJsonSync();
          expect(modelConfig.Review.dataSource).to.eql('db1');
          done();
        });
      });
    });

    it('should set dataSource to db if it exists', function(done) {
      wsModels.DataSourceDefinition.create([{
        name: 'db1',
        connector: 'memory',
        facetName: 'server',
      }, {
        name: 'db',
        connector: 'memory',
        facetName: 'server',
      }], function(err) {
        if (err) return done(err);
        var modelGen = givenModelGenerator();
        helpers.mockPrompt(modelGen, {
          name: 'Review',
          plural: 'Reviews',
        });

        modelGen.run(function() {
          var modelConfig = readModelsJsonSync();
          expect(modelConfig.Review.dataSource).to.eql('db');
          done();
        });
      });
    });
  });

  function givenModelGenerator(modelArgs) {
    var path = '../../model';
    var name = 'loopback:model';
    var deps = [['../../property', 'loopback:property']];
    var gen = common.createGenerator(name, path, deps, modelArgs, {});
    return gen;
  }

  function readProductJsonSync() {
    var productJson = path.resolve(SANDBOX, 'common/models/product.json');
    expect(fs.existsSync(productJson), 'file exists');
    return JSON.parse(fs.readFileSync(productJson));
  }

  function readModelsJsonSync(facet) {
    facet = facet || 'server';
    var filepath = path.resolve(SANDBOX, facet, 'model-config.json');
    var content = fs.readFileSync(filepath, 'utf-8');
    return JSON.parse(content);
  }
});
