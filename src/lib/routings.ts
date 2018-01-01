import { EventRoutingDefiner } from "lazy-event-router";
import { InformationRouting } from "./controllers";

export const routings: EventRoutingDefiner[] = [
    InformationRouting,
];
