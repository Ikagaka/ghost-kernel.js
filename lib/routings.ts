import { EventRoutingDefiner } from "lazy-event-router";
import {
    InformationRouting,
    KernelOperationRouting,
    MenuRouting,
    NotifyInformationRouting,
    SakuraScriptRouting,
    ShellRouting,
    TimeEventRouting,
    VersionRouting,
    VisibilityRouting,
} from "./controllers";

export const routings: EventRoutingDefiner[] = [
    InformationRouting,
    KernelOperationRouting,
    MenuRouting,
    NotifyInformationRouting,
    SakuraScriptRouting,
    ShellRouting,
    TimeEventRouting,
    VersionRouting,
    VisibilityRouting,
];
