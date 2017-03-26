"use strict";
var path = require('path');
var changeCase = require('change-case');
var generators = require('yeoman-generator');
var fs = require('fs');
var ejs = require('ejs');
var _ = require('underscore');
_.mixin(require('underscore.inflections'));
/**
 * @module ServerGenerator [FireLoop]
 * @author Jonathan Casarrubias <t: johncasarrubias, gh:mean-expert-official>
 * @description
 * This module generates and configure a FireLoop Server
 */
module.exports = generators.extend({
    // Not reinventing the wheel, let LoopBack Generator to build the Base.
    initializing: function () {
        if (Array.isArray(this.options._argv._) && this.options._argv._.length === 0) {
            throw new Error('Please define a model name: $ fireloop model [Name]');
        }
        this.root = this.destinationRoot();
        var clients = this.config.get('clients') || {};
        var serverName;
        Object.keys(clients).forEach(function (key) {
            if (clients[key].type === 'server') {
                serverName = key;
            }
        });
        if (!serverName) {
            throw new Error('No API server was found');
        }
        else {
            this.destinationRoot(serverName);
            this.composeWith('loopback:model', {
                args: this.options._argv._
            }, { local: require.resolve('generator-fllb/model') });
        }
    },
    // Replace JS Model for TS Model
    end: function () {
        var _this = this;
        var modelName = this.options._argv._[0];
        // Get param cased name
        var casedName = changeCase.paramCase(modelName);
        // Update json file with mixins
        var fname = this.destinationPath("./common/models/" + casedName + ".json");
        var config = require(fname);
        config.mixins = {
            TimeStamp: {
                required: false
            },
            Stats: [
                {
                    method: 'stats',
                    endpoint: '/stats',
                    description: "Statistical information for " + modelName + " registers.",
                    type: 'model',
                    count: {
                        on: 'createdAt',
                        by: 'index'
                    }
                }
            ]
        };
        fs.writeFileSync(fname, JSON.stringify(config, null, 2));
        if (!config.plural) {
            config.plural = _.pluralize(casedName);
        }
        // Replace JS for TS File
        fs.unlinkSync("./common/models/" + casedName + ".js");
        [
            {
                template: 'templates/fireloop/model.ts',
                output: "./common/models/" + casedName + ".ts",
                params: { modelName: modelName }
            },
            {
                template: 'templates/fireloop/test.spec.ts',
                output: "./tests/" + casedName + ".spec.ts",
                params: {
                    modelName: modelName,
                    config: config,
                    propertyBuilder: propertyBuilder
                }
            }
        ].forEach(function (config) {
            console.info('Generating: %s', "" + config.output);
            // TODO: Migrate to native yeoman fs library tool
            fs.writeFileSync(_this.destinationPath(config.output), ejs.render(fs.readFileSync(require.resolve(__dirname + "/../../" + config.template), { encoding: 'utf-8' }), config.params));
        });
    }
});
function propertyBuilder(config) {
    var properties = [];
    Object.keys(config.properties).forEach(function (propName) {
        var property = config.properties[propName];
        switch (property.type) {
            case 'string':
                properties.push("\n            " + propName + ": 'test'");
                break;
            case 'number':
                properties.push("\n            " + propName + ": 12345");
                break;
            case 'date':
                properties.push("\n            " + propName + ": '" + new Date() + "'");
                break;
            case 'geopoint':
                properties.push("\n            " + propName + ": { lat: 100.100, lng: 100.100 }");
                break;
        }
    });
    return "" + properties.join(",") + (properties.length > 0 ? '\n        ' : '');
}
//# sourceMappingURL=/Volumes/HD710M/development/www/mean.expert/@mean-expert/fireloop.io/generator-fireloop/src/model/index.js.map