import { EventRoutingDefiner } from "lazy-event-router";
import {
    InformationRouting,
    KernelOperationRouting,
    NotifyInformationRouting,
    TimeEventRouting,
    VersionRouting,
    VisibilityRouting,
} from "./controllers";

export const routings: EventRoutingDefiner[] = [
    InformationRouting,
    KernelOperationRouting,
    NotifyInformationRouting,
    TimeEventRouting,
    VersionRouting,
    VisibilityRouting,
];
