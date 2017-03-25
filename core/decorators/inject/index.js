"use strict";
/**
 * @author Andres Jimenez Fork from @mean-expert/boot-script by Jonathan Casarrubias
 * @module Inject Decorator
 * @license MIT
 * @description
 * This decorator will return singleton instances
 * This avoids the need of creating static Injects
 **/
var prepared = [];
function Inject(dependencies) {
    'use strict';
    var args = [];
    Array.prototype.push.apply(args, dependencies.providers);
    // return the function specified by ts documentation
    return function (target) {
        // the new constructor behaviour
        var f = function () {
            // prepre holder for instances
            var instances = [];
            // retrive instance of the class
            for (var _i = 0, _a = f._dependencies; _i < _a.length; _i++) {
                var entry = _a[_i];
                instances.push(instanceiateDependency(f, entry));
            }
            // apply to original target constructor
            target.apply(this, instances);
            f._instance = this;
        };
        // loop all the providers and attach who is providing them
        for (var _i = 0, _a = dependencies.providers; _i < _a.length; _i++) {
            var provider = _a[_i];
            // check if any providing is there
            if (provider._providing === undefined) {
                provider._providing = [];
            }
            // save reference to this class
            provider._providing.push(f);
        }
        // copy prototype
        f.prototype = target.prototype;
        f._dependencies = args;
        prepared.push(f);
        return f;
    };
}
exports.Inject = Inject;
function instanceiateDependency(caller, target) {
    'use strict';
    // temp reference to instances
    var temp;
    // check if an instances exists
    if (target._instance === undefined) {
        // create new instance
        target._instance = new target();
        // check if any classes should be enabled first
        if (target._providing !== undefined) {
            // if caller is not allowed basically
            if (target._providing.indexOf(caller) === -1) {
                // create new instances of them first
                for (var _i = 0, _a = target._providing; _i < _a.length; _i++) {
                    var provider = _a[_i];
                    temp = new provider();
                }
                // delete all stuff about providing
                delete target._providing;
            }
        }
    }
    return target._instance;
}
/**
 * Propouse this function for the bootstrap instance of the app loopback/fireLoopBootstrap
 *  with typescript, but dependens of migration server.js to typescript.
 *
 * @export
 * @param {Injectable} main
 */
function fireLoopBootstrap(main) {
    'use strict';
    var tmp;
    // start everything
    for (var _i = 0, prepared_1 = prepared; _i < prepared_1.length; _i++) {
        var entry = prepared_1[_i];
        // start only if not allready started
        if (entry._instance === undefined) {
            tmp = new entry();
        }
    }
    // start instance
    if (main._instance === undefined) {
        this.main = new main();
    }
    else {
        this.main = main._instance;
    }
}
exports.fireLoopBootstrap = fireLoopBootstrap;
//# sourceMappingURL=C:/Users/a-jimenez/mean-expert/fireloop.io/core/src/decorators/inject/index.js.map