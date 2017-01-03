/**
 * @class ModelRegister
 * @author Jonathan Casarrubias <t: johncasarrubias, gh: mean-expert-official>
 * @license MIT
 * @description
 * This class will register a model reference, hooks and remote methods.
 */
export class ModelRegister {
  constructor(Model: any, reference: any) {
    // Register reference
    Model.model = reference;
    // Register Hooks
    Object.keys(Model.hooks).forEach((hook: string) => {
      switch(Model.hooks[hook].type) {
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
    Object.keys(Model.remotes).forEach(
      (remote: string) => {
        reference[remote] = function () {  Model[remote].apply(Model, arguments); };
        reference.remoteMethod(remote, Model.remotes[remote]);
      }
    );
  }
}