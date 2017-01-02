"use strict";
var ModelRegister = (function () {
    function ModelRegister(Model, reference) {
        Model.model = reference;
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
        Object.keys(Model.remotes).forEach(function (remote) {
            reference[remote] = function () { Model[remote].apply(Model, arguments); };
            reference.remoteMethod(remote, Model.remotes[remote]);
        });
    }
    return ModelRegister;
}());
exports.ModelRegister = ModelRegister;
//# sourceMappingURL=index.js.map