#!/usr/bin/env node
/**
 * @module FireLoop CLI Tool
 * @author Jonathan Casarrubias <t: johncasarrubias, gh: mean-expert-official>
 * @license MTI
 * @description
 * 
 * This CLI Tool generates FireLoop projects and provides a handful way to work
 * with MEAN Stack based Applications.
 **/
const yargs  = require('yargs')
const chalk  = require('chalk');
const path   = require('path');
const yeoman = require('yeoman-environment');
const env    = yeoman.createEnv();
/**
 * CLI Options Description
 */
var argv = yargs
  .usage('\n********************* FireLoop CLI Tool ************************\n' +
  '\nGenerate FireLoop Projects, Angular 2 Clients and SDK.' +
  '\nUsage:' +
  '\n $ fireloop [command [options]]')
  .describe('p', 'Generate new fireloop project on the current directory.')
  .alias({ p: 'project' })
  .argv;

  if (!argv._ || argv._.length === 0) {
    env.register(require.resolve('generator-fireloop'), 'fireloop');
    env.register(require.resolve('generator-fireloop/generators/server'), 'fireloop:server');
    env.register(require.resolve('generator-fireloop/generators/ng2'), 'fireloop:ng2');
    env.register(require.resolve('generator-fireloop/generators/ng2web'), 'fireloop:ng2web');
    env.register(require.resolve('generator-fireloop/generators/sdk'), 'fireloop:sdk');
    env.register(require.resolve('generator-fireloop/generators/server'), 'fireloop:server');
    env.register(require.resolve('generator-fireloop/generators/setup'), 'fireloop:setup');
    return env.run('fireloop');
  }
