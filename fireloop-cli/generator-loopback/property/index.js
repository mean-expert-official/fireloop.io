// Copyright IBM Corp. 2014,2016. All Rights Reserved.
// Node module: generator-loopback
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

var g = require('../lib/globalize');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var actions = require('../lib/actions');
var helpers = require('../lib/helpers');
var helpText = require('../lib/help');
var validateRequiredName = helpers.validateRequiredName;
var checkPropertyName = helpers.checkPropertyName;
var typeChoices = helpers.getTypeChoices();
var debug = require('debug')('loopback:generator:property');

module.exports = yeoman.Base.extend({
  // NOTE(bajtos)
  // This generator does not track file changes via yeoman,
  // as loopback-workspace is editing (modifying) files when
  // saving project changes.

  help: function() {
    return helpText.customHelp(this, 'loopback_property_usage.txt');
  },

  loadProject: actions.loadProject,

  loadModels: actions.loadModels,

  askForModel: function() {
    if (this.options.modelName) {
      this.modelName = this.options.modelName;
      return;
    }

    var prompts = [
      {
        name: 'model',
        message: g.f('Select the model:'),
        type: 'list',
        choices: this.editableModelNames,
      },
    ];

    return this.prompt(prompts).then(function(answers) {
      this.modelName = answers.model;
    }.bind(this));
  },

  findModelDefinition: function() {
    this.modelDefinition = this.projectModels.filter(function(m) {
      return m.name === this.modelName;
    }.bind(this))[0];

    if (!this.modelDefinition) {
      var msg = g.f('Model not found: %s', this.modelName);
      this.log(chalk.red(msg));
      this.async()(new Error(msg));
    }
  },

  askForParameters: function() {
    if (this.modelDefinition.base === 'KeyValueModel') {
      var msg = g.f('KeyValueModel does not support model definition ' +
        'properties');
      this.log(chalk.red(msg));
      return this.async(new Error(msg));
    }

    this.name = this.options.propertyName;

    var prompts = [
      {
        name: 'name',
        message: g.f('Enter the property name:'),
        validate: checkPropertyName,
        default: this.propDefinition && this.propDefinition.name,
        when: function() {
          return !this.name && this.name !== 0;
        }.bind(this),
      },
      {
        name: 'type',
        message: g.f('Property type:'),
        type: 'list',
        default: this.propDefinition &&
          (Array.isArray(this.propDefinition.type) ?
            'array' : this.propDefinition.type),
        choices: typeChoices,
      },
      {
        name: 'customType',
        message: g.f('Enter the type:'),
        required: true,
        validate: validateRequiredName,
        when: function(answers) {
          return answers.type === null;
        },
      },
      {
        name: 'itemType',
        message: g.f('The type of array items:'),
        type: 'list',
        default: this.propDefinition &&
          this.propDefinition.type &&
          Array.isArray(this.propDefinition.type) &&
          this.propDefinition.type[0],
        choices: typeChoices.filter(function(t) { return t !== 'array'; }),
        when: function(answers) {
          return answers.type === 'array';
        },
      },
      {
        name: 'customItemType',
        message: g.f('Enter the item type:'),
        validate: validateRequiredName,
        when: function(answers) {
          return answers.type === 'array' && answers.itemType === null;
        },
      },
      {
        name: 'required',
        message: g.f('Required?'),
        type: 'confirm',
        default: false,
      },
      {
        name: 'defaultValue',
        message: g.f('Default value[leave blank for none]:'),
        default: null,
        when: function(answers) {
          return answers.type !== null &&
            answers.type !== 'buffer' &&
            answers.type !== 'any' &&
            typeChoices.indexOf(answers.type) !== -1;
        },
      },
    ];
    return this.prompt(prompts).then(function(answers) {
      debug('answers: %j', answers);
      this.name = answers.name || this.name;
      if (answers.type === 'array') {
        var itemType =  answers.customItemType || answers.itemType;
        this.type = itemType ? [itemType] : 'array';
      } else {
        this.type = answers.customType || answers.type;
      }

      this.propDefinition = {
        name: this.name,
        type: this.type,
      };
      if (answers.required) {
        this.propDefinition.required = Boolean(answers.required);
      }

      if (answers.defaultValue === '') {
        answers.defaultValue = null;
        return;
      }

      try {
        debug('property definition input: %j', this.propDefinition);
        coerceDefaultValue(this.propDefinition, answers.defaultValue);
        debug('property coercion output: %j', this.propDefinition);
      } catch (err) {
        debug('Failed to coerce property default value: ', err);
        this.log(g.f('Warning: please enter the %s property again. The ' +
          'default value provided "%s" is not valid for the selected type: %s',
          this.name, answers.defaultValue, this.type));
        return this.askForParameters();
      }
    }.bind(this));
  },

  property: function() {
    var done = this.async();
    this.modelDefinition.properties.create(this.propDefinition, function(err) {
      helpers.reportValidationError(err, this.log);
      return done(err);
    }.bind(this));
  },
  saveProject: actions.saveProject,
});

function coerceDefaultValue(propDef, value) {
  var itemType;
  if (Array.isArray(propDef.type)) {
    itemType = propDef.type[0];
    propDef.type = 'array';
  }

  switch (propDef.type) {
    case 'string':
      if (value === 'uuid' || value === 'guid') {
        propDef.defaultFn = value;
      } else {
        propDef.default = value;
      }
      break;
    case 'number':
      propDef.default = castToNumber(value);
      break;
    case 'boolean':
      propDef.default = castToBoolean(value);
      break;
    case 'date':
      if (value.toLowerCase() === 'now') {
        propDef.defaultFn = 'now';
      } else {
        propDef.default = castToDate(value);
      }
      break;
    case 'array':
      propDef.type = [itemType];
      if (itemType === 'string') {
        propDef.default = value.replace(/[\s,]+/g, ',').split(',');
      } else if (itemType === 'number') {
        propDef.default = value.replace(/[\s,]+/g, ',').split(',')
          .map(castToNumber);
      } else if (itemType === 'boolean') {
        propDef.default = value.replace(/[\s,]+/g, ',').split(',')
          .map(castToBoolean);
      } else if (itemType === 'date') {
        propDef.default = value.replace(/[\s,]+/g, ',').split(',')
          .map(castToDate);
      } else {
        propDef.default = value;
      }
      break;
    case 'geopoint':
      if (value.indexOf('lat') !== -1 && value.indexOf('lng') !== -1) {
        propDef.default = JSON.parse(value);
      } else {
        var geo = value.replace(/[\s,]+/g, ',').split(',');
        propDef.default = {};
        propDef.default.lat = castToNumber(geo[0]);
        propDef.default.lng = castToNumber(geo[1]);
      }
      break;
    case 'object':
      propDef.default = JSON.parse(value);
      break;
    default:
      propDef.default = value;
  }
}

function castToDate(value) {
  var dateValue;
  var isNumber = /^[0-9]+$/.test(value);
  if (isNumber) {
    dateValue = new Date(castToNumber(value));
  } else {
    dateValue = new Date(value);
  }
  if (isNaN(dateValue.getTime())) {
    throw Error(g.f('Invalid default Date value: %s', value));
  }
  return dateValue;
}

function castToNumber(value) {
  var numberValue = Number(value);
  if (isNaN(numberValue)) {
    throw Error('Invalid default number value: ' + value);
  }
  return numberValue;
}

function castToBoolean(value) {
  if (['true', '1', 't', 'false', '0', 'f'].indexOf(value) === -1) {
    throw Error('Invalid default boolean value "' + value +
      '". Expected default values: true|false, 1|0, t|f');
  }
  return (['true', '1', 't'].indexOf(value) !== -1) ? true : false;
}
