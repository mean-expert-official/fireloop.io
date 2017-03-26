// Copyright IBM Corp. 2014,2016. All Rights Reserved.
// Node module: generator-loopback
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';
var url = require('url');
var chalk = require('chalk');

var generator = require('loopback-swagger');
var request = require('request');
var yaml = require('js-yaml');
var fs = require('fs');
var async = require('async');

function buildUrl(base, path) {
  if (path.indexOf('/') === 0) {
    path = path.substring(1);
  }
  var baseUrl = url.parse(base);
  var pathName = baseUrl.pathname;
  if (pathName.substring(pathName.length - 1) !== '/') {
    pathName = pathName + '/';
  }
  base = url.resolve(base, pathName);
  return url.resolve(base, path);
}

/**
 * Load swagger specs from the given url or file path; handle yml or json
 * @param {String} specUrlStr The url or file path to the swagger spec
 * @param cb
 */
function loadSpec(specUrlStr, log, cb) {
  log(chalk.blue('Loading ' + specUrlStr + '...'));
  var specUrl = url.parse(specUrlStr);
  specUrl.pathname = encodeURI(specUrl.pathname);
  if (specUrl.protocol === 'http:' || specUrl.protocol === 'https:') {
    var options = {
      url: url.format(specUrl),
      headers: {
        'Accept': 'application/json',
      },
    };
    request.get(options, function(err, res, body) {
      if (err) {
        return cb(err);
      }

      if (res.statusCode === 200) {
        var spec;
        try {
          if (typeof body === 'string') {
            spec = JSON.parse(body);
          } else {
            spec = body;
          }
        } catch (err) {
          return cb(err);
        }
        cb(null, spec);
      } else {
        err = new Error('HTTP status: ' + res.statusCode +
          ' [' + specUrlStr + ']');
        err.details = body;
        cb(err);
      }
    });
  } else {
    if (specUrl.href.match(/\.(yaml|yml)$/)) {
      try {
        var spec = yaml.safeLoad(fs.readFileSync(specUrl.href, 'utf8'));
        cb(null, spec);
      } catch (err) {
        cb(err);
      }
    } else {
      fs.readFile(specUrl.href, 'UTF-8', function(err, body) {
        if (err) {
          return cb(err);
        }
        try {
          var spec = JSON.parse(body);
          cb(null, spec);
        } catch (err) {
          cb(err);
        }
      });
    }
  }
}

/**
 * Parse the spec. For v1.2, it will recursively load all the api specs
 * @param {String} base The base url/path
 * @param {Object} spec The swagger v1.2 resource listing or v2 spec
 * @param cb
 */
function parseSpec(base, spec, log, cb) {
  if (spec.swaggerVersion === '1.2') {
    if (Array.isArray(spec.apis)) {
      if (spec.apis[0] && spec.apis[0].operations) {
        process.nextTick(function() {
          cb(null, [spec]);
        });
        return;
      }
      var specs = [];
      async.each(spec.apis, function(api, done) {
        var apiUrl = buildUrl(base, api.path);
        loadSpec(apiUrl, log, function(err, spec) {
          specs.push(spec);
          done(err);
        });
      }, function(err) {
        cb(err, specs);
      });
    }
  } else if (spec.swagger === '2.0') {
    process.nextTick(function() {
      cb(null, [spec]);
    });
  } else {
    process.nextTick(function() {
      var err = new Error('Invalid/unsupported swagger spec');
      cb(err);
    });
  }
}

/**
 * Generate code from a spec http/https url or file path
 * @param {String} specUrl swagger spec http/https url or file path
 * @param cb
 */
function generate(specUrl, log, cb) {
  var apis = [];
  loadSpec(specUrl, log, function(err, spec) {
    if (err) {
      return cb(err);
    }
    parseSpec(specUrl, spec, log, function(err, apiSpecs) {
      if (err) {
        return cb(err);
      }
      async.each(apiSpecs, function(apiSpec, done) {
        generator.getGenerator(apiSpec).mapTagsToModels(apiSpec);
        var models = generator.generateModels(apiSpec);
        var code = generator.generateRemoteMethods(apiSpec,
          {modelName: 'SwaggerModel'});

        var api = {
          code: code,
          models: models,
          spec: apiSpec,
        };
        apis.push(api);

        done(null);
      }, function(err) {
        cb(err, apis);
      });
    });
  });
}

module.exports = generate;
