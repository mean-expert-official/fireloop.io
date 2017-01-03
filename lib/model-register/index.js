"use strict";
/**
 * @class ModelRegister
 * @author Jonathan Casarrubias <t: johncasarrubias, gh: mean-expert-official>
 * @license MIT
 * @description
 * This class will register a model reference, hooks and remote methods.
 */
var ModelRegister = (function () {
    function ModelRegister(Model, reference) {
        // Register reference
        Model.model = reference;
        // Register Hooks
        Object.keys(Model.hooks).forEach(function (hook) {
            switch (Model.hooks[hook].type) {
                case 'operation':
                    reference.observe(Model.hooks[hook].name, function () {
                        Model[hook].apply(Model, arguments);
                    });
                    break;
                case 'beforeRemote':
                case 'afterRemote':
                    reference[Model.hooks[hook].type](Model.hooks[hook].name, function () {
                        Model[hook].apply(Model, arguments);
                    });
                    break;
                default:
                    throw new Error('FireLoop: Unexpected hook type');
            }
        });
        // Register Remote Methods
        Object.keys(Model.remotes).forEach(function (remote) {
            reference[remote] = function () { Model[remote].apply(Model, arguments); };
            reference.remoteMethod(remote, Model.remotes[remote]);
        });
    }
    return ModelRegister;
}());
exports.ModelRegister = ModelRegister;
//# sourceMappingURL=C:/Users/a-jimenez/mean-expert/fireloop.io/lib/src/model-register/index.js.map