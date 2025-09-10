import IModules from "./IModules";
export default function Module(name: string): <T extends {
    new (): IModules;
}>(ctor: T) => void;
