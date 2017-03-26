// Copyright IBM Corp. 2014,2016. All Rights Reserved.
// Node module: generator-loopback
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

/* global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-test');
var wsModels = require('loopback-workspace').models;
var SANDBOX =  path.resolve(__dirname, 'sandbox');
var expect = require('chai').expect;
var common = require('./common');

describe('loopback:relation generator', function() {
  beforeEach(common.resetWorkspace);
  beforeEach(function createSandbox(done) {
    helpers.testDirectory(SANDBOX, done);
  });

  beforeEach(function createProject(done) {
    common.createDummyProject(SANDBOX, 'test-app', done);
  });

  beforeEach(function createCarModel(done) {
    var test = this;
    wsModels.ModelDefinition.create(
      {
        name: 'Car',
        facetName: 'common',
      },
      function(err, model) {
        test.Model = model;
        done(err);
      });
  });

  it('adds an entry to common/models/{name}.json', function(done) {
    var relationGenerator = givenRelationGenerator();
    helpers.mockPrompt(relationGenerator, {
      model: 'Car',
      toModel: 'Part',
      asPropertyName: 'parts',
      foreignKey: 'customKey',
      type: 'hasMany',
    });

    relationGenerator.run(function() {
      var definition = common.readJsonSync('common/models/car.json');
      var relations = definition.relations || {};
      expect(relations).to.have.property('parts');
      expect(relations.parts).to.eql({
        type: 'hasMany',
        foreignKey: 'customKey',
        model: 'Part',
      });
      done();
    });
  });

  it('asks for custom model name', function(done) {
    var relationGenerator = givenRelationGenerator();
    helpers.mockPrompt(relationGenerator, {
      model: 'Car',
      toModel: null,
      customToModel: 'Part',
      asPropertyName: 'parts',
      foreignKey: 'customKey',
      type: 'hasMany',
    });

    relationGenerator.run(function() {
      var definition = common.readJsonSync('common/models/car.json');
      var relations = definition.relations || {};
      expect(relations).to.have.property('parts');
      expect(relations.parts).to.eql({
        type: 'hasMany',
        foreignKey: 'customKey',
        model: 'Part',
      });
      done();
    });
  });

  it('asks for through model name', function(done) {
    var relationGenerator = givenRelationGenerator();
    helpers.mockPrompt(relationGenerator, {
      model: 'Car',
      toModel: 'Part',
      asPropertyName: 'parts',
      foreignKey: 'customKey',
      type: 'hasMany',
      through: true,
      throughModel: 'CarPart',
    });

    relationGenerator.run(function() {
      var definition = common.readJsonSync('common/models/car.json');
      var relations = definition.relations || {};
      expect(relations).to.have.property('parts');
      expect(relations.parts).to.eql({
        type: 'hasMany',
        foreignKey: 'customKey',
        model: 'Part',
        through: 'CarPart',
      });
      done();
    });
  });

  it('asks for custom through model name', function(done) {
    var relationGenerator = givenRelationGenerator();
    helpers.mockPrompt(relationGenerator, {
      model: 'Car',
      toModel: 'Part',
      asPropertyName: 'parts',
      foreignKey: 'customKey',
      type: 'hasMany',
      through: true,
      throughModel: null,
      customThroughModel: 'CarPart',
    });

    relationGenerator.run(function() {
      var definition = common.readJsonSync('common/models/car.json');
      var relations = definition.relations || {};
      expect(relations).to.have.property('parts');
      expect(relations.parts).to.eql({
        type: 'hasMany',
        foreignKey: 'customKey',
        model: 'Part',
        through: 'CarPart',
      });
      done();
    });
  });

  // requires generator-yeoman v0.17
  it('provides default property name based on target model for belongsTo',
    function(done) {
      var relationGenerator = givenRelationGenerator();
      helpers.mockPrompt(relationGenerator, {
        model: 'Car',
        toModel: 'Part',
        type: 'belongsTo',
      });
      relationGenerator.run(function() {
        var definition = common.readJsonSync('common/models/car.json');
        var relations = definition.relations || {};
        expect(Object.keys(relations)).to.include('part');
        done();
      });
    }
  );

  // requires generator-yeoman v0.17
  it('provides default property name based on target model for hasMany',
    function(done) {
      var relationGenerator = givenRelationGenerator();
      helpers.mockPrompt(relationGenerator, {
        model: 'Car',
        toModel: 'Part',
        type: 'hasMany',
      });
      relationGenerator.run(function() {
        var definition = common.readJsonSync('common/models/car.json');
        var relations = definition.relations || {};
        expect(Object.keys(relations)).to.include('parts');
        done();
      });
    }
  );

  function givenRelationGenerator() {
    var name = 'loopback:relation';
    var path = '../../relation';
    var gen = common.createGenerator(name, path);
    return gen;
  }
});
