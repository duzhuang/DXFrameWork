import { EventCenter } from "../core/event/index";

if (CC_DEV) {
    window["EventCenter"] = EventCenter;
}