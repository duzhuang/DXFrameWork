import { UIConfig } from "../config/UIConfig";

export interface IUIWorkflow {
    open(config: UIConfig, data?: any): Promise<cc.Node>;
    close(config: UIConfig, uiNode: cc.Node): Promise<void>;
}