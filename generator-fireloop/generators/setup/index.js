"use strict";
var fs = require('fs');
var yosay = require('yosay');
var rmdir = require('rimraf');
var mkdirp = require('mkdirp');
var path = require('path');
var generators = require('yeoman-generator');
var chalk = require('chalk');
var ejs = require('ejs');
/**
 * @module ServerGenerator [FireLoop]
 * @author Jonathan Casarrubias <t: johncasarrubias, gh:mean-expert-official>
 * @description
 * This module generates and configure a FireLoop Server
 */
module.exports = generators.extend({
    // The name `constructor` is important here
    constructor: function () {
        // Calling the super constructor is important so our generator is correctly set up
        generators.apply(this, arguments);
        this.log(chalk.yellow('Let\'s setup up the FireLoop Modules.'));
    },
    // Configure Component
    configureComponent: function () {
        var _this = this;
        rmdir.sync(this.destinationPath('client'));
        [
            {
                template: 'templates/component-config.json',
                output: { directory: 'server', file: 'component-config.json' },
                params: {}
            },
            {
                template: 'templates/server.js',
                output: { directory: 'server', file: 'server.js' },
                params: {}
            },
            {
                template: 'templates/model-config.json',
                output: { directory: 'server', file: 'model-config.json' },
                params: {}
            },
            {
                template: 'templates/nodemon.json',
                output: { directory: './', file: 'nodemon.json' },
                params: {}
            },
            {
                template: 'templates/tsconfig.srv.tpl',
                output: { directory: './', file: 'tsconfig.json' },
                params: {}
            }
        ].forEach(function (config) {
            console.info('Generating: %s', "" + config.output.file);
            var cwd = _this.destinationPath(config.output.directory);
            // TODO: Decouple and polish the code in below
            try {
                fs.accessSync(cwd, fs.F_OK);
                generate(cwd, config);
            }
            catch (e) {
                mkdirp(cwd);
                generate(cwd, config);
            }
        });
    }
});
function generate(cwd, config) {
    fs.writeFileSync(path.join(cwd, config.output.file), ejs.render(fs.readFileSync(require.resolve(__dirname + "/../../" + config.template), { encoding: 'utf-8' }), config.params));
}
//# sourceMappingURL=/Volumes/HD710M/development/www/mean.expert/@mean-expert/fireloop.io/generator-fireloop/src/setup/index.js.map