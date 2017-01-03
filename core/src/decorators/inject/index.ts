import { Dependencies } from './dependencies';
import { Injectable }   from './injectable';

/**
 * @author Andres Jimenez Fork from @mean-expert/boot-script by Jonathan Casarrubias
 * @module Inject Decorator
 * @license MIT
 * @description
 * This decorator will return singleton instances
 * This avoids the need of creating static Injects
 **/
let prepared: Array<any> = [];

export function Inject(dependencies: Dependencies): Function {
    'use strict';

    let args: Array<Function> = [];

    Array.prototype.push.apply(args, dependencies.providers);

    // return the function specified by ts documentation
    return (target: any) => {

        // the new constructor behaviour
        let f: any = function (): any {

            // prepre holder for instances
            let instances: Array<any> = [];

            // retrive instance of the class
            for (let entry of f._dependencies) {
                instances.push(instanceiateDependency(f, entry));
            }

            // apply to original target constructor
            target.apply(this, instances);
            f._instance = this;
        };


        // loop all the providers and attach who is providing them
        for (let provider of dependencies.providers) {

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

function instanceiateDependency(caller: Injectable, target: Injectable): any {

    'use strict';

    // temp reference to instances
    let temp: any;

    // check if an instances exists
    if (target._instance === undefined) {

        // create new instance
        target._instance = new target();

        // check if any classes should be enabled first
        if (target._providing !== undefined) {

            // if caller is not allowed basically
            if (target._providing.indexOf(caller) === -1) {

                // create new instances of them first
                for (let provider of target._providing) {

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
export function fireLoopBootstrap(main: Injectable): void {

    'use strict';

    let tmp: any;

    // start everything
    for (let entry of prepared) {

        // start only if not allready started
        if (entry._instance === undefined) {

            tmp = new entry();
        }
    }

    // start instance
    if (main._instance === undefined) {
        this.main = new main();
    } else {
        this.main = main._instance;
    }
}