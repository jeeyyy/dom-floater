export const CONSTANTS = {
    MESSAGES: {
        ERROR_IN_CONFIGURATION_NO_TYPE: `Error in Floater Configuration. No Type provided`,
        ERROR_IN_CONFIGURATION_NO_POPUP_TARGET: `Error in Floater Configuration. No Popup Target Element provided.`
    },
    COMMON_KEY_CODES: {
        BACKSPACE: 8,

        RETURN: 13,
        ESC: 27,
        SPACE: 32,

        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,

        ZERO: 48,
        ONE: 49,
        TWO: 50,

        a: 65,
        b: 66,
        F: 70,
        k: 75,
        m: 77,

        WIN_or_CMD: 91  // to detect cmd on key up use this, on keydown you can use event.metaKey
    },
    KEYS: {
        BACKSPACE: 8,
        TAB: 9,
        RETURN: 13,
        ESC: 27,
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        DELETE: 46,
        HOME: 36,
        END: 35,
        PAGEUP: 33,
        PAGEDOWN: 34,
        INSERT: 45,
        ZERO: 48,
        ONE: 49,
        TWO: 50,
        A: 65,
        L: 76,
        P: 80,
        Q: 81,
        TILDA: 192
    },
    TRANSITION_TIMES: 300, // this should match css transition times (we often fade things out then remove them)
    BREAKPOINTS: {
        XS: 400,
        SM: 680,
        MD: 1024,
        LG: 1200
    }
};
