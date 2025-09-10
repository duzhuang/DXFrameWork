import ModuleManager from "./ModuleManager";
export default function Module(name) {
    return function (ctor) {
        var inst = new ctor();
        ModuleManager.instance.registerModule(name, inst);
    };
}
