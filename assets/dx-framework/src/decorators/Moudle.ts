import IModule from "../core/IModule";
import ModuleManager from "../core/ModuleManager";


export default function Module(token: string) {
    return function <T extends { new(...args: any[]): IModule }>(ctor: T) {
        //方式一：通过构造函数注册
        //ModuleManager.instance.registerModuleByConstructor(token, ctor);
        //方式二：通过实例注册
        ModuleManager.instance.registerModule(token, new ctor());
    };
}