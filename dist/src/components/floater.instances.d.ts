import { IFloater } from "../interfaces";
export declare class FloaterInstances {
    private _instances;
    add(instance: IFloater.Configuration): void;
    remove(instance: IFloater.Configuration): void;
    destroyAll(): void;
    getInstanceById(guid: string): IFloater.Configuration;
    getInstancesOfType(instanceType: IFloater.Type): Array<IFloater.Configuration>;
}
export declare const floaterInstances: FloaterInstances;
