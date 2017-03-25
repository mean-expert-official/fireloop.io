"use strict";
var lib_1 = require("@fireloop/lib");
/**
 * @author Jonathan Casarrubias
 * @module Model Decorator
 * @license MIT
 * @description
 * This decorator will register fireloop models
 **/
function Model(arg) {
    function f(target) {
        function ff(reference) {
            var instance = new target(reference);
            if (!arg || Object.keys(arg).length === 0) {
                return instance;
            }
            instance = Object.assign(instance, arg);
            new lib_1.ModelRegister(instance, reference);
            return instance;
        }
        return ff;
    }
    return f;
}
exports.Model = Model;
//# sourceMappingURL=C:/Users/a-jimenez/mean-expert/fireloop.io/core/src/decorators/model/index.js.map