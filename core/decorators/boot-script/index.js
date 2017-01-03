"use strict";
/**
 * @author Jonathan Casarrubias
 * @module BootScript Decorator
 * @license MIT
 * @description
 * This decorator will return boot script instances
 * This avoids the need of creating static bootscripts
 **/
function BootScript() {
    function f(target) {
        function BootScriptInstance(reference) {
            return new target(reference);
        }
        return BootScriptInstance;
    }
    return f;
}
exports.BootScript = BootScript;
//# sourceMappingURL=C:/Users/a-jimenez/mean-expert/fireloop.io/core/src/decorators/boot-script/index.js.map