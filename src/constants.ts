export const CONSTANTS = {
  TIME_SPAN: {
    MS_50: 50,
    MS_300: 300
  },
  MESSAGES: {
    ERROR_NO_DOCUMENT_BODY: `No document or html body present.`,
    ERROR_IN_CONFIGURATION_NO_TYPE: `Error in Floater Configuration. No Floater Type provided`,
    ERROR_IN_CONFIGURATION_NO_CONTENT_ELEMENT_TYPE: `Error in Floater Configuration. No Content Element Type provided`,
    ERROR_IN_CONFIGURATION_NO_POPUP_TARGET: `Error in Floater Configuration. No Popup Target Element provided.`,
    ERROR_IN_FINDING_POPUP_SCROLLABLE_PARENT: `Error in finding scrollable parent with supplied selector. Cannot position and track popup position with out correct parent reference. Kindly check supplied selector.`
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

    WIN_or_CMD: 91 // to detect cmd on key up use this, on keydown you can use event.metaKey
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
  BREAKPOINTS: {
    XS: 400,
    SM: 680,
    MD: 1024,
    LG: 1200
  }
};
