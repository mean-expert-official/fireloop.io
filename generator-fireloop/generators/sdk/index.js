"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require('path');
var yosay = require('yosay');
var generators = require('yeoman-generator');
/**
 * @module Builder [FireLoop]
 * @author Jonathan Casarrubias <t: johncasarrubias, gh:mean-expert-official>
 * @description
 * This module generates and configures a FireLoop SDK
 */
module.exports = generators.extend({
    /**
     * @module fireloop:sdk
     * @author Brannon N. Darby II <gh:brannon-darby>
     */
    constructor: function () {
        generators.apply(this, arguments);
        this.log(yosay('Let\'s build an SDK!'));
    },
    prompting: function () {
        var _this = this;
        this.options.clients = this.config.get('clients') || {};
        // Filter clients only not server.
        var clients = [];
        if (typeof this.options.clients === 'object') {
            Object.keys(this.options.clients).forEach(function (name) {
                if (_this.options.clients[name].type.match(/(ng2web|ng2ionic|ng2native|ng2universal)/)) {
                    clients.push(name);
                }
            });
        }
        var sdkOptions = {
            IO: 'Enable PubSub + IO + FireLoop functionality',
            FIRELOOP_ONLY: 'Generate ONLY FireLoop SDK + Auth Services',
            NGRX: 'Enable NGRX functionality',
            DEFAULT_VALUES: 'Add default values in models'
        };
        var features = [
            sdkOptions.IO,
            sdkOptions.FIRELOOP_ONLY,
            sdkOptions.NGRX,
            sdkOptions.DEFAULT_VALUES,
        ];
        var defaultSelected = [
            sdkOptions.IO,
        ];
        var sharedPaths = {
            ng2web: 'src/app/shared/sdk',
            ng2universal: 'src/app/shared/sdk',
            ng2native: 'app/shared/sdk',
            ng2ionic: 'src/app/shared/sdk'
        };
        return this.prompt([{
                type: 'list',
                name: 'client',
                message: 'For which application do you want to build an SDK?',
                default: 0,
                choices: clients
            }, {
                type: 'checkbox',
                name: 'sdkFeatures',
                message: 'What SDK features do you want to include?',
                default: defaultSelected,
                choices: features,
                store: true
            }]).then(function (answers) {
            this.client = this.options.clients[answers.client];
            this.client.name = answers.client;
            this.sdkFeatures = answers.sdkFeatures;
            this.sdkOptions = sdkOptions;
            return this.prompt([{
                    type: 'input',
                    name: 'sdkPath',
                    message: 'In what directory should the SDK be created?',
                    default: this.client.sdkPath || path.join(this.client.path, sharedPaths[this.client.type])
                }]).then(function (answers) {
                this.sdkPath = answers.sdkPath;
            }.bind(this));
        }.bind(this));
    },
    buildSDK: function () {
        var _this = this;
        var serverPath;
        console.log('Searching for server path...');
        Object.keys(this.options.clients).forEach(function (name) {
            if (_this.options.clients[name].type === 'server') {
                serverPath = _this.options.clients[name].path;
                console.log('Server path found: ', serverPath);
            }
        });
        this.spawnCommand('node_modules/.bin/lb-sdk', [
            'server/server',
            this.destinationPath(this.sdkPath || 'webapp/src/app/shared/sdk'),
            '-d', !this.options.clientType || this.options.clientType.match(/(ng2web|ng2ionic)/)
                ? 'ng2web'
                : this.options.clientType.trim(),
            '-w', 'enabled',
            '-i', (this.sdkFeatures.indexOf(this.sdkOptions.IO) > -1) ? 'enabled' : 'disabled',
            '-f', (this.sdkFeatures.indexOf(this.sdkOptions.FIRELOOP) > -1) ? 'enabled' : 'disabled',
            '-n', (this.sdkFeatures.indexOf(this.sdkOptions.NGRX) > -1) ? 'enabled' : 'disabled',
            '-v', (this.sdkFeatures.indexOf(this.sdkOptions.DEFAULT_VALUES) > -1) ? 'enabled' : 'disabled'
        ], {
            shell: true,
            cwd: this.destinationPath(serverPath)
        });
        this.options.clients[this.client.name].sdkPath = this.sdkPath;
        this.config.set('clients', this.options.clients);
    }
});
//# sourceMappingURL=C:/Users/bdarby/Desktop/fireloop.io/generator-fireloop/src/sdk/index.js.map