// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: generator-loopback
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';
var path = require('path');
var helpers = require('yeoman-test');
var fs = require('fs');
var expect = require('chai').expect;
var wsModels = require('loopback-workspace').models;
var common = require('./common');
var yaml = require('js-yaml');
var install = require('strong-cached-install');
var SANDBOX =  path.resolve(__dirname, 'sandbox');
var PKG_CACHE = path.resolve(__dirname, '..', '.pkgcache');

describe('loopback:export-api-def generator', function() {
  this.timeout(30 * 60 * 1000); // 30 minutes
  before(common.resetWorkspace);

  before(function createSandbox(done) {
    helpers.testDirectory(SANDBOX, done);
  });

  before(function createProject(done) {
    common.createDummyProject(SANDBOX, 'test-app', done);
  });

  before(function createProductModel(done) {
    var test = this;
    wsModels.ModelDefinition.create(
      {
        name: 'Product',
        facetName: 'common',
      },
      function(err, model) {
        test.Model = model;
        done(err);
      });
  });

  before(function installDependencies(done) {
    install(SANDBOX, PKG_CACHE, ['dependencies'], done);
  });

  it('produces JSON format', function(done) {
    var gen = givenGenerator();
    gen.options.output = 'swagger.json';

    gen.run(function() {
      var content = readJsonFile();
      expect(content).to.have.property('swagger', '2.0');
      expect(content).to.not.have.property('host');
      expect(content).to.not.have.property('schemes');
      expect(content).to.not.have.property('public');
      expect(content).to.have.property('basePath');
      expect(content).to.have.property('info');
      expect(content.info).to.have.property(
        'title', 'test-app');
      expect(content).to.have.property('tags');
      expect(content.consumes).to.have.members([
        'application/json',
        'application/x-www-form-urlencoded',
        'application/xml', 'text/xml',
      ]);
      expect(content.produces).to.have.members([
        'application/json',
        'application/xml', 'text/xml',
        'application/javascript', 'text/javascript',
      ]);
      done();
    });
  });

  it('produces YAML format', function(done) {
    var gen = givenGenerator();
    gen.options.output = 'swagger.yaml';

    gen.run(function() {
      var content = readYamlFile();
      expect(content).to.have.property('swagger', '2.0');
      expect(content).to.not.have.property('host');
      expect(content).to.not.have.property('schemes');
      expect(content).to.not.have.property('public');
      expect(content).to.have.property('basePath');
      expect(content).to.have.property('info');
      expect(content.info).to.have.property(
        'title', 'test-app');
      expect(content).to.have.property('tags');
      expect(content.consumes).to.have.members([
        'application/json',
        'application/x-www-form-urlencoded',
        'application/xml', 'text/xml',
      ]);
      expect(content.produces).to.have.members([
        'application/json',
        'application/xml', 'text/xml',
        'application/javascript', 'text/javascript',
      ]);
      done();
    });
  });

  function givenGenerator(args) {
    var path = '../../export-api-def';
    var name = 'loopback:export-api-def';
    var gen = common.createGenerator(name, path, [], args);
    gen.options['skip-install'] = false;
    return gen;
  }

  function readJsonFile() {
    var jsonFile = path.resolve(SANDBOX, 'swagger.json');
    var content = fs.readFileSync(jsonFile, 'utf-8');
    return JSON.parse(content);
  }

  function readYamlFile() {
    var yamlFile = path.resolve(SANDBOX, 'swagger.yaml');
    var content = fs.readFileSync(yamlFile, 'utf-8');
    return yaml.load(content);
  }
});
