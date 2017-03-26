// Copyright IBM Corp. 2015,2016. All Rights Reserved.
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

describe('loopback:remote-method generator', function() {
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
    var methodGenerator = givenMethodGenerator();
    helpers.mockPrompt(methodGenerator, {
      model: 'Car',
      methodName: 'myRemote',
      isStatic: 'true',
      desription: 'This is my first remote method',
      httpPath: '',
      acceptsArg: '',
      returnsArg: '',
    });

    methodGenerator.run(function() {
      var definition = common.readJsonSync('common/models/car.json');
      var methods = definition.methods || {};
      expect(methods).to.have.property('myRemote');
      expect(methods.myRemote).to.eql({
        isStatic: true,
        accepts: [],
        returns: [],
        http: [],
      });
      done();
    });
  });

  it('method name with `prototype.` should be removed', function(done) {
    var methodGenerator = givenMethodGenerator();
    helpers.mockPrompt(methodGenerator, {
      model: 'Car',
      methodName: 'prototype.myRemote',
      isStatic: 'false',
      desription: 'This is my first remote method',
      httpPath: '',
      acceptsArg: '',
      returnsArg: '',
    });

    methodGenerator.run(function() {
      var definition = common.readJsonSync('common/models/car.json');
      var methods = definition.methods || {};
      expect(methods).to.have.property('myRemote');
      expect(methods).to.not.have.property('prototype.myRemote');
      expect(methods.myRemote).to.eql({
        isStatic: false,
        accepts: [],
        returns: [],
        http: [],
      });
      done();
    });
  });

  function givenMethodGenerator() {
    var name = 'loopback:remote-method';
    var path = '../../remote-method';
    var gen = common.createGenerator(name, path);
    return gen;
  }
});
