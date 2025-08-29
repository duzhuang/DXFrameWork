import { UIConfig } from "./UIConfig";

export interface IUIWorkflow {
    open(config: UIConfig, data?: any): Promise<cc.Node>;
    close(config: UIConfig, uiNode: cc.Node): Promise<void>;
}