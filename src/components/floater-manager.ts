import { floaterInstances } from './floater-instances';
import Floater from './floater';

// wrapper class to encapsulate floater instances
export class FloaterManager {

    getInstanceById(guid: string): Floater {
        return floaterInstances.getInstanceById(guid);
    }
    
    destroy(instance) {
        floaterInstances.destroy(instance)
    }

}

export const floaterManager = new FloaterManager();