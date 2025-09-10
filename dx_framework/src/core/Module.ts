import IModules from "./IModules";
import ModuleManager from "./ModuleManager";

export default function Module(name: string) {
    return function <T extends { new(): IModules }>(ctor: T) {
        const inst = new ctor();
        ModuleManager.instance.registerModule(name, inst);
    }
}
