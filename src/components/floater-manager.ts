import { floaterInstances } from './floater-instances';

// wrapper class to encapsulate floater instances
export class FloaterManager {
    
    destroy(instance) {
        floaterInstances.destroy(instance)
    }

}

export const floaterManager = new FloaterManager();