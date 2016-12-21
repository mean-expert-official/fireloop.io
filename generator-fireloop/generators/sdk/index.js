"use strict";
var path = require('path');
var yosay = require('yosay');
var generators = require('yeoman-generator');
/**
 * @module Builder [FireLoop]
 * @author Jonathan Casarrubias <t: johncasarrubias, gh:mean-expert-official>
 * @description
 * This module generates and configure a FireLoop Server
 */
module.exports = generators.Base.extend({
    // The name `constructor` is important here
    constructor: function () {
        // Calling the super constructor is important so our generator is correctly set up
        generators.Base.apply(this, arguments);
        this.log(yosay('Building your FireLoop SDK!'));
    },
    /**
     * TODO
     * Add interface to let users decide the following 3 options:
     * -f enabled | disabled
     * -i enabled | disabled
     * -v enabled | disabled
     *
     * NOTE: -d and -w should remain as they are.
     */
    buildSDK: function () {
        this.spawnCommand('node_modules/.bin/lb-sdk', [
            this.options.serverPath || 'server/server',
            path.join('../', this.options.clientPath || 'webapp/src/app/shared/sdk'),
            '-d', !this.options.clientType || this.options.clientType.match(/(ng2web|ng2ionic)/)
                ? 'ng2web'
                : this.options.clientType.trim(),
            '-w', 'enabled'
        ], { shell: true, cwd: this.destinationPath('fireloop') });
    }
});
//# sourceMappingURL=/Volumes/HD710M/development/www/mean.expert/@mean-expert/fireloop.io/generator-fireloop/src/sdk/index.js.map