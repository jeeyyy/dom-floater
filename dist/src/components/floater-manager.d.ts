import Floater from "./floater";
export declare class FloaterManager {
    getInstanceById(guid: string): Floater;
    destroy(instance: any): void;
}
export declare const floaterManager: FloaterManager;
