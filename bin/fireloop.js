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
  .argv;
// Register generators
env.register(require.resolve('generator-fireloop'), 'fireloop');
// Show default menu when no command is added
if (!argv._ || argv._.length === 0) {
  env.register(require.resolve('generator-fireloop/generators/app'), 'fireloop:app');
  env.register(require.resolve('generator-fireloop/generators/ng2'), 'fireloop:ng2');
  env.register(require.resolve('generator-fireloop/generators/ng2web'), 'fireloop:ng2web');
  env.register(require.resolve('generator-fireloop/generators/nativescript'), 'fireloop:nativescript');
  env.register(require.resolve('generator-fireloop/generators/sdk'), 'fireloop:sdk');
  env.register(require.resolve('generator-fireloop/generators/server'), 'fireloop:server');
  env.register(require.resolve('generator-fireloop/generators/setup'), 'fireloop:setup');
  return env.run('fireloop');
}
// Process Commands
const cmd = argv._.shift();
try {
  if (cmd.match(/(ng2web|nativescript)/))
  return console.log(chalk.red('This command can not stand alone.'));
  var loopbacked = `loopback:${cmd}`;
  var firelooped = `fireloop:${cmd}`;
  if (cmd === 'model') {
    env.register(require.resolve(`generator-loopback/model`), loopbacked);
    env.register(require.resolve(`generator-loopback/property`), `loopback:property`);
  }
  env.register(require.resolve(`generator-fireloop/generators/${cmd}`), firelooped);
  env.run(firelooped, { _argv: argv });
} catch (err) {
  throw err;
}
  