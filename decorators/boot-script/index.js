"use strict";
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
//# sourceMappingURL=index.js.map