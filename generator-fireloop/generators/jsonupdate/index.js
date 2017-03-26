"use strict";
var fs = require('fs');
var yosay = require('yosay');
var generators = require('yeoman-generator');
var chalk = require('chalk');
/**
 * @module JSONUpdate [FireLoop]
 * @author Jonathan Casarrubias <t: johncasarrubias, gh:mean-expert-official>
 * @description
 * This module updates JSON Files
 */
module.exports = generators.extend({
    // The name `constructor` is important here
    constructor: function () {
        // Calling the super constructor is important so our generator is correctly set up
        generators.apply(this, arguments);
    },
    method: function () {
        console.log('UPDATING JSON File: ', this.options.filePath);
        var config = Object.assign(require(this.options.filePath), this.options.replace);
        fs.writeFileSync(this.options.filePath, JSON.stringify(config, null, 2));
        this.log(chalk.green('Updating: ', this.options.filePath));
    }
});
//# sourceMappingURL=/Volumes/HD710M/development/www/mean.expert/@mean-expert/fireloop.io/generator-fireloop/src/jsonupdate/index.js.map