// Copyright IBM Corp. 2015. All Rights Reserved.
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
var common = require('./common');

describe('loopback:boot-script generator', function() {
  beforeEach(common.resetWorkspace);

  beforeEach(function createSandbox(done) {
    helpers.testDirectory(SANDBOX, done);
  });

  beforeEach(function createProject(done) {
    common.createDummyProject(SANDBOX, 'test-app', done);
  });

  it('generates an async boot script properly', function(done) {
    var bootGen = givenBootScriptGenerator();
    helpers.mockPrompt(bootGen, {
      name: 'async-boot-script',
      type: 'async',
    });

    bootGen.run(function() {
      var target = path.resolve(SANDBOX, 'server/boot/async-boot-script.js');
      expect(fs.existsSync(target), 'file exists');

      var targetContents = fs.readFileSync(target, 'utf8');
      var src = path.resolve(__dirname, '../boot-script/templates/async.js');
      var srcContents = fs.readFileSync(src, 'utf8');
      expect(targetContents).to.equal(srcContents);

      done();
    });
  });

  it('generates a sync boot script properly', function(done) {
    var bootGen = givenBootScriptGenerator();
    helpers.mockPrompt(bootGen, {
      name: 'sync-boot-script',
      type: 'sync',
    });

    bootGen.run(function() {
      var target = path.resolve(SANDBOX, 'server/boot/sync-boot-script.js');
      expect(fs.existsSync(target), 'file exists');

      var targetContents = fs.readFileSync(target, 'utf8');
      var src = path.resolve(__dirname, '../boot-script/templates/sync.js');
      var srcContents = fs.readFileSync(src, 'utf8');
      expect(targetContents).to.equal(srcContents);

      done();
    });
  });

  function givenBootScriptGenerator(bsArgs) {
    var path = '../../boot-script';
    var name = 'loopback:boot-script';
    var gen = common.createGenerator(name, path, [], bsArgs, {});
    return gen;
  }
});
