declare var skel: {
  /******************************/
  /******************************/
  /**
   * IDs of breakpoints that are currently active.
   * @type {array}
   */
  breakpointIds: null;
  /**
   * Events.
   * @type {object}
   */
  events: {};
  /**
   * Are we initialized?
   * @type {bool}
   */
  isInit: boolean;
  /**
   * Objects.
   * @type {object}
   */
  obj: {
    attachments: {};
    breakpoints: {};
    head: null;
    states: {};
  };
  /**
   * State ID delimiter (don't change this).
   * @type {string}
   */
  sd: string;
  /**
   * Current state.
   * @type {object}
   */
  state: null;
  /**
   * State handlers.
   * @type {object}
   */
  stateHandlers: {};
  /**
   * Current state ID.
   * @type {string}
   */
  stateId: string;
  /**
   * Internal vars.
   * @type {object}
   */
  vars: {};
  /******************************/
  /******************************/
  /**
   * Does stuff when the DOM is ready.
   * @param {function} f Function.
   */
  DOMReady: null;
  /**
   * Wrapper/polyfill for (Array.prototype|String).indexOf.
   * @param {Array|string} search Object or string to search.
   * @param {integer} from Starting index.
   * @return {integer} Matching index (or -1 if there's no match).
   */
  indexOf: null;
  /**
   * Wrapper/polyfill for Array.isArray.
   * @param {array} x Variable to check.
   * @return {bool} If true, x is an array. If false, x is not an array.
   */
  isArray: null;
  /**
   * Safe replacement for "for..in". Avoids stuff that doesn't belong to the array itself (eg. properties added to Array.prototype).
   * @param {Array} a Array to iterate.
   * @param {function} f(index) Function to call on each element.
   */
  iterate: null;
  /**
   * Determines if a media query matches the current browser state.
   * @param {string} query Media query.
   * @return {bool} True if it matches, false if not.
   */
  matchesMedia: null;
  /**
   * Extends x by y.
   * @param {object} x Target object.
   * @param {object} y Source object.
   */
  extend: (x: any, y: any) => void;
  /**
   * Creates a new style element.
   * @param {string} content Content.
   * @return {DOMHTMLElement} Style element.
   */
  newStyle: (content: any) => HTMLStyleElement;
  /******************************/
  /******************************/
  /**
   * Temporary element for canUse()
   * @type {DOMElement}
   */
  _canUse: null;
  /**
   * Determines if the browser supports a given property.
   * @param {string} p Property.
   * @return {bool} True if property is supported, false if not.
   */
  canUse: (p: any) => boolean;
  /******************************/
  /******************************/
  /**
   * Registers one or more events.
   * @param {string} names Space-delimited list of event names.
   * @param {function} f Function.
   */
  on: (names: any, f: any) => any;
  /**
   * Triggers an event.
   * @param {string} name Name.
   */
  trigger: (name: any) => any | undefined;
  /******************************/
  /******************************/
  /**
   * Gets a breakpoint.
   * @param {string} id Breakpoint ID.
   * @return {Breakpoint} Breakpoint.
   */
  breakpoint: (id: any) => any;
  /**
   * Sets breakpoints.
   * @param {object} breakpoints Breakpoints.
   */
  breakpoints: (breakpoints: any) => any;
  /******************************/
  /******************************/
  /**
   * Adds a state handler.
   * @param {string} id ID.
   * @param {function} f Handler function.
   */
  addStateHandler: (id: any, f: any) => void;
  /**
   * Calls a state handler.
   * @param {string} id ID.
   */
  callStateHandler: (id: any) => void;
  /**
   * Switches to a different state.
   * @param {string} newStateId New state ID.
   */
  changeState: (newStateId: any) => void;
  /**
   * Generates a state-specific config.
   * @param {object} baseConfig Base config.
   * @param {object} breakpointConfigs Breakpoint-specific configs.
   * @return {object} State-specific config.
   */
  generateStateConfig: (baseConfig: any, breakpointConfigs: any) => {};
  /**
   * Gets the current state ID.
   * @return {string} State ID.
   */
  getStateId: () => string;
  /**
   * Polls for state changes.
   */
  poll: () => void;
  /******************************/
  /******************************/
  /**
   * Attach point for attach()
   * @type {DOMElement}
   */
  _attach: null;
  /**
   * Attaches a single attachment.
   * @param {object} attachment Attachment.
   * @return bool True on success, false on failure.
   */
  attach: (attachment: any) => boolean;
  /**
   * Attaches a list of attachments.
   * @param {array} attachments Attachments.
   */
  attachAll: (attachments: any) => void;
  /**
   * Detaches a single attachment.
   * @param {object} attachment Attachment.
   * @return bool True on success, false on failure.
   */
  detach: (attachment: any) => boolean;
  /**
   * Detaches all attachments.
   * @param {object} exclude A list of attachments to exclude.
   */
  detachAll: (exclude: any) => void;
  attachment: (id: any) => any;
  /**
   * Creates a new attachment.
   * @param {string} id ID.
   * @param {DOMElement} element DOM element.
   */
  newAttachment: (id: any, element: any, priority: any, permanent: any) => {
    id: any;
    element: any;
    priority: any;
    permanent: any;
  };
  /******************************/
  /******************************/
  /**
   * Initializes skel.
   * This has to be explicitly called by the user.
   */
  init: (arg: InitOpt1, arg2: InitOpt2) => void;
  /**
   * Initializes browser events.
   */
  initEvents: () => void;
  /**
   * Initializes methods.
   */
  initMethods: () => void;
  /**
   * Initializes the vars.
   */
  initVars: () => void;
};
type InitOpt1 = {
  prefix: string;
  resetCSS: boolean;
  boxModel: string;
  grid: {
    gutters: number;
  };
  breakpoints: {
    mobile: {
      range: string;
      lockViewport: boolean;
      containers: string;
      grid: {
        collapse: boolean;
        gutters: number;
      };
    };
    desktop: {
      range: string;
      containers: number;
    };
    '1000px': {
      range: string;
      containers: number;
    };
  };
};
type InitOpt2 = {
  panels: {
    panels: {
      navPanel: {
        breakpoints: string;
        position: string;
        style: string;
        size: string;
        html: string;
      };
    };
    overlays: {
      titleBar: {
        breakpoints: string;
        position: string;
        height: number;
        width: string;
        html: string;
      };
    };
  };
};