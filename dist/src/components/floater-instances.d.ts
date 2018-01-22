import { IFloater } from "../interfaces";
import Floater from "./floater";
export declare class FloaterInstances {
    private _instances;
    add(floater: Floater): void;
    destroy(floater: Floater): void;
    getInstanceById(guid: string): Floater;
    getInstancesOfType(instanceType: IFloater.Type): Array<Floater>;
}
export declare const floaterInstances: FloaterInstances;
