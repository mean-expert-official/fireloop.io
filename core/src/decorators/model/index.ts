declare var Object: any;
declare var module: any;
import { ModelRegister } from '@fireloop/lib';
/**
 * @author Jonathan Casarrubias
 * @module Model Decorator
 * @license MIT
 * @description
 * This decorator will register fireloop models
 **/
export function Model(arg: { hooks?: {}, remotes?: {} }) {
    function f(target: any)
    {
        function ff(reference: any)
        {
            let instance: any = new target(reference);
            if (!arg ||  Object.keys(arg).length === 0) {
                return instance;
            }
            instance = Object.assign(instance, arg);
            new ModelRegister(instance, reference);
            return instance;
        }
        return <any>ff;
    }
    return f
}
