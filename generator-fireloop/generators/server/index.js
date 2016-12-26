"use strict";
var generators = require('yeoman-generator');
var mkdirp = require('mkdirp');
var rmdir = require('rimraf');
var fs = require('fs');
var ejs = require('ejs');
var chalk = require("chalk");
var path = require("path");
/**
 * @module ServerGenerator [FireLoop]
 * @author Jonathan Casarrubias <t: johncasarrubias, gh:mean-expert-official>
 * @description
 * This module generates and configure a FireLoop Server
 */
module.exports = generators.Base.extend({
    // The name `constructor` is important here
    constructor: function () {
        // Calling the super constructor is important so our generator is correctly set up
        generators.Base.apply(this, arguments);
        this.log(chalk.yellow('\nSetting up new FireLoop environment.\n'));
    },
    // Not reinventing the wheel, let LoopBack Generator to build the Base.
    installBase: function () {
        this.composeWith('fireloop:loopback', {
            options: { skipNextSteps: true }
        }, {
            local: require.resolve('generator-fllb')
        });
    },
    install: function () {
        this.npmInstall([
            '@mean-expert/loopback-sdk-builder',
            'ts-node',
            'typescript',
            '@types/node',
            '@types/mocha'
        ], { 'save-dev': true });
        this.npmInstall([
            '@mean-expert/loopback-component-realtime',
            '@mean-expert/loopback-stats-mixin',
            '@mean-expert/model',
            '@mean-expert/boot-script',
            'loopback-ds-timestamp-mixin',
            'cookie-parser',
            'chai',
            'mocha',
            'supertest',
            'cookie-parser'
        ], { 'save': true });
    },
    end: function () {
        var _this = this;
        rmdir.sync(this.destinationPath('client'));
        rmdir.sync(this.destinationPath('server/boot/root.js'));
        rmdir.sync(this.destinationPath('server/boot/authentication.js'));
        [
            {
                template: 'templates/fireloop/component-config.json',
                output: { directory: 'server', file: 'component-config.json' },
                params: {}
            },
            {
                template: 'templates/fireloop/server.js',
                output: { directory: 'server', file: 'server.js' },
                params: {}
            },
            {
                template: 'templates/fireloop/model-config.json',
                output: { directory: 'server', file: 'model-config.json' },
                params: {}
            },
            {
                template: 'templates/fireloop/testing.ts',
                output: { directory: 'server/boot', file: 'testing.ts' },
                params: {}
            },
            {
                template: 'templates/fireloop/root.ts',
                output: { directory: 'server/boot', file: 'root.ts' },
                params: {}
            },
            {
                template: 'templates/fireloop/authentication.ts',
                output: { directory: 'server/boot', file: 'authentication.ts' },
                params: {}
            },
            {
                template: 'templates/fireloop/nodemon.json',
                output: { directory: './', file: 'nodemon.json' },
                params: {}
            },
            {
                template: 'templates/fireloop/tsconfig.json',
                output: { directory: './', file: 'tsconfig.json' },
                params: {}
            },
            {
                template: 'templates/tests/keepme.txt',
                output: { directory: 'tests', file: '.keepme' },
                params: {}
            }
        ].forEach(function (config) {
            console.info('Generating: %s', "" + config.output.file);
            var _cwd = _this.destinationPath(config.output.directory);
            // TODO: Decouple and polish the code in below
            try {
                fs.accessSync(_cwd, fs.F_OK);
                generate(_cwd, config);
            }
            catch (e) {
                mkdirp(_cwd);
                generate(_cwd, config);
            }
        });
        this.composeWith('fireloop:jsonupdate', {
            options: {
                filePath: this.destinationPath('package.json'),
                replace: {
                    scripts: {
                        lint: 'eslint .',
                        start: 'node server/server.js',
                        posttest: 'npm run lint && nsp check',
                        test: 'NODE_ENV=testing npm run start'
                    }
                }
            }
        });
        if (this.options.skipNextSteps)
            return;
        this.log('\nNext steps:\n');
        this.log('\tCreate a model in your server');
        this.log(chalk.green('\t\t$ fireloop model [ModelName]\n'));
        this.log('\tCreate a new Angular 2 Client or SDK');
        this.log(chalk.green('\t\t$ fireloop\n'));
        this.log('\tServe an application');
        this.log(chalk.green('\t\t$ fireloop serve\n'));
    },
});
function generate(cwd, config) {
    fs.writeFileSync(path.join(cwd, config.output.file), ejs.render(fs.readFileSync(path.join(__dirname, '..', '..', config.template), { encoding: 'utf-8' }), config.params));
}
//# sourceMappingURL=C:/Users/bdarby/Desktop/fireloop.io/generator-fireloop/src/server/index.js.map