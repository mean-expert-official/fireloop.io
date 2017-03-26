// Copyright IBM Corp. 2014,2016. All Rights Reserved.
// Node module: generator-loopback
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

/* global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-test');
var SANDBOX = path.resolve(__dirname, 'sandbox');
var fs = require('fs');
var expect = require('chai').expect;
var common = require('./common');

describe('loopback:swagger generator', function() {
  beforeEach(common.resetWorkspace);

  beforeEach(function createSandbox(done) {
    helpers.testDirectory(SANDBOX, done);
  });

  beforeEach(function createProject(done) {
    common.createDummyProject(SANDBOX, 'test-app', done);
  });

  it('creates and configures Pet model from swagger 2.0 spec',
    function(done) {
      var modelGen = givenModelGenerator();
      helpers.mockPrompt(modelGen, {
        url: path.join(__dirname, 'swagger/pet-store-2.0.json'),
        modelSelections:
        ['swagger_v2_petstore', 'Category',
          'Pet', 'Tag', 'Order', 'Customer'],
        dataSource: 'db',
      });

      modelGen.run(function() {
        var content = readModelJsonSync('pet');
        expect(content).to.have.property('name', 'Pet');
        expect(content).to.not.have.property('public');
        expect(content).to.have.property('properties');
        expect(content.properties).to.have.property('tags');
        expect(content.properties).to.have.property('category');

        expect(content.properties.tags.type).to.eql(['Tag']);
        expect(content.properties.category.type).to.eql('Category');
        expect(content.properties.photoUrls.type).to.eql(['string']);

        var modelConfig = readModelConfigSync('server');
        expect(modelConfig).to.have.property('Pet');
        expect(modelConfig.Pet).to.have.property('public', false);
        expect(modelConfig.Pet).to.have.property('dataSource', 'db');
        done();
      });
    });

  it('creates and configures Pet model from swagger 2.0 spec yml',
    function(done) {
      var modelGen = givenModelGenerator();
      helpers.mockPrompt(modelGen, {
        url: path.join(__dirname, 'swagger/pet-store-2.0.yml'),
        modelSelections:
        ['swagger_v2_petstore', 'Category',
          'Pet', 'Tag', 'Order', 'Customer'],
        dataSource: 'db',
      });

      modelGen.run(function() {
        var content = readModelJsonSync('pet');
        expect(content).to.have.property('name', 'Pet');
        expect(content).to.not.have.property('public');
        expect(content).to.have.property('properties');
        expect(content.properties).to.have.property('tags');
        expect(content.properties).to.have.property('category');

        expect(content.properties.tags.type).to.eql(['Tag']);
        expect(content.properties.category.type).to.eql('Category');
        expect(content.properties.photoUrls.type).to.eql(['string']);

        var modelConfig = readModelConfigSync('server');
        expect(modelConfig).to.have.property('Pet');
        expect(modelConfig.Pet).to.have.property('public', false);
        expect(modelConfig.Pet).to.have.property('dataSource', 'db');
        done();
      });
    });

  it('creates and configures note model from swagger 2.0 spec yaml',
    function(done) {
      var modelGen = givenModelGenerator();
      helpers.mockPrompt(modelGen, {
        url: path.join(__dirname, 'swagger/demo4.yaml'),
        modelSelections:
          ['swagger_api', 'note'],
        dataSource: 'db',
      });

      modelGen.run(function() {
        var content = readModelJsonSync('note');
        expect(content).to.have.property('name', 'note');
        expect(content).to.not.have.property('public');
        expect(content).to.have.property('properties');
        expect(content.properties).to.have.property('title');
        expect(content.properties).to.have.property('content');

        expect(content.properties.title.type).to.eql('string');
        expect(content.properties.title.required).to.eql(true);
        expect(content.properties.content.type).to.eql('string');

        var modelConfig = readModelConfigSync('server');
        expect(modelConfig).to.have.property('note');
        expect(modelConfig.note).to.have.property('public', true);
        expect(modelConfig.note).to.have.property('dataSource', 'db');
        done();
      });
    });

  it('creates and configures Pet model from swagger 1.2 spec',
    function(done) {
      var modelGen = givenModelGenerator();
      helpers.mockPrompt(modelGen, {
        url: path.join(__dirname, 'swagger/pet-store-1.2.json'),
        modelSelections: ['swagger_pet', 'Category', 'Pet', 'Tag'],
        dataSource: 'db',
      });

      modelGen.run(function() {
        var content = readModelJsonSync('pet');
        expect(content).to.have.property('name', 'Pet');
        expect(content).to.not.have.property('public');
        expect(content).to.have.property('properties');
        expect(content.properties).to.have.property('tags');
        expect(content.properties).to.have.property('category');

        expect(content.properties.tags.type).to.eql(['Tag']);
        expect(content.properties.category.type).to.eql('Category');
        expect(content.properties.photoUrls.type).to.eql(['string']);

        var modelConfig = readModelConfigSync('server');
        expect(modelConfig).to.have.property('Pet');
        expect(modelConfig.Pet).to.have.property('public', false);
        expect(modelConfig.Pet).to.have.property('dataSource', 'db');
        done();
      });
    });

  function givenModelGenerator(modelArgs) {
    var path = '../../swagger';
    var name = 'loopback:swagger';
    var deps = [];
    var gen = common.createGenerator(name, path, deps, modelArgs, {});
    return gen;
  }

  function readModelJsonSync(name, facet) {
    facet = facet || 'common';
    var petJson = path.resolve(SANDBOX, facet + '/models/' + name + '.json');
    expect(fs.existsSync(petJson), 'file exists');
    return JSON.parse(fs.readFileSync(petJson));
  }

  function readModelConfigSync(facet) {
    facet = facet || 'server';
    var filepath = path.resolve(SANDBOX, facet, 'model-config.json');
    var content = fs.readFileSync(filepath, 'utf-8');
    return JSON.parse(content);
  }
});
