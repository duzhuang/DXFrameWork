import IModule from "../core/IModule";
import ModuleManager from "../core/ModuleManager";


export default function Module(token: string) {
    return function <T extends { new(...args: any[]): IModule }>(ctor: T) {        
        ModuleManager.instance.registerModuleByConstructor(token, ctor);
    };
}