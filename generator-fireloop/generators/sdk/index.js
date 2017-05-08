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
        var sdkOptions = {
            IO: 'Enable PubSub + IO + FireLoop functionality',
            FIRELOOP_ONLY: 'Generate ONLY FireLoop SDK + Auth Services',
            NGRX: 'Enable NGRX functionality',
            DEFAULT_VALUES: 'Add default values in models'
        };
        var choices = [
            sdkOptions.IO,
            sdkOptions.FIRELOOP_ONLY,
            sdkOptions.NGRX,
            sdkOptions.DEFAULT_VALUES,
        ];
        var defaultSelected = [
            sdkOptions.IO,
        ];
        var selected = {};
        return this.prompt([{
                type: 'checkbox',
                name: 'list',
                message: 'What SDK features do you want to include?',
                default: defaultSelected,
                choices: choices
            }]).then(function (answers) {
            var _this = this;
            answers.list.forEach(function (answer) {
                _this.selected[answer] = true;
            });
        }.bind(this));
    },
    buildSDK: function () {
        var _this = this;
        this.options.clients = this.config.get('clients') || {};
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
            path.join('../', this.options.clientPath || 'webapp/src/app/shared/sdk'),
            '-d', !this.options.clientType || this.options.clientType.match(/(ng2web|ng2ionic)/)
                ? 'ng2web'
                : this.options.clientType.trim(),
            '-w', 'enabled',
            '-i', this.selected[this.sdkOptions.IO] ? 'enabled' : 'disabled',
            '-f', this.selected[this.sdkOptions.FIRELOOP] ? 'enabled' : 'disabled',
            '-n', this.selected[this.sdkOptions.NGRX] ? 'enabled' : 'disabled',
            '-v', this.selected[this.sdkOptions.DEFAULT_VALUES] ? 'enabled' : 'disabled'
        ], {
            shell: true,
            cwd: this.destinationPath(serverPath)
        });
    }
});
//# sourceMappingURL=C:/Users/bdarby/Desktop/fireloop.io/generator-fireloop/src/sdk/index.js.map