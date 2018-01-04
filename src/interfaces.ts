export namespace IFloater {

    export interface BaseComponent {

        init: (parentElement?: HTMLElement) => Promise<void>;
        addListeners();
        destroy: () => Promise<void>;
    }

    export type Dimensions = {
        width: number;
        height: number;
    }

}
