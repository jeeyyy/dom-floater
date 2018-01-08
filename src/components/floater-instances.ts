import { IFloater } from "../interfaces";

export class FloaterInstances {

    private _instances = {}; // dynamically crated objects - key value pairs

    add(instance: IFloater.Configuration) {
        this._instances[instance.guid] = instance;
    }

    remove(instance: IFloater.Configuration) {
        delete this._instances[instance.guid];
    }

    destroyAll() {
        this._instances = null;
    }

    getInstanceById(guid: string): IFloater.Configuration {
        return this._instances[guid];
    }

    getInstancesOfType(instanceType: IFloater.Type): Array<IFloater.Configuration> {
        const instanceIds = Object.keys(this._instances);
        let result: IFloater.Configuration[] = [];
        if (instanceIds && instanceIds.length > 0) {
            instanceIds.forEach((instanceGuid: string) => {
                const instance = this.getInstanceById(instanceGuid);
                if (instance && instance.type === instanceType) {
                    result.push(instance);
                }
            });
        }
        return result;
    }
}

export const floaterInstances = new FloaterInstances();

