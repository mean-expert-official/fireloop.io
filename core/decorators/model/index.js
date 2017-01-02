"use strict";
var lib_1 = require("@fireloop/lib");
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
//# sourceMappingURL=index.js.map