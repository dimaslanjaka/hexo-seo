/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference types="jquery" />
/// <reference lib="dom" />

declare const $: JQuery;

type jQuery = JQuery;

interface XMLHttpRequest extends XMLHttpRequestEventTarget {
  responseJSON: Array<any> | Record<string, unknown> | null;
}

interface EventTarget {
  matches(pattern: string): boolean;
}

/**
 * HTML element
 */
interface HTMLScriptElement extends HTMLElement {
  async: boolean;

  onreadystatechange(): void;
}

interface HTMLElement
  extends Element,
  DocumentAndElementEventHandlers,
  ElementCSSInlineStyle,
  ElementContentEditable,
  GlobalEventHandlers,
  HTMLOrSVGElement {
  mozMatchesSelector: (selectors: string) => boolean;
  msMatchesSelector: (selectors: string) => boolean;

  [attachEvent: string]: any;
}

/**
 * Create element options
 */
interface createElementOpt {
  childs: any[];
  /**
   * Tag name to be created
   */
  tagName: string;
  /**
   * Add classname
   */
  className: string;
  /**
   * Some attributes ?
   */
  attributes: { attributes: { [str: string]: any } };
  /**
   * InnerText ?
   */
  text: string;
  /**
   * InnerHTML ?
   */
  html: string;
  /**
   * Some options
   */
  options: { attributes: any[]; childs: [] };
}

/**
 * Create element helper
 * * if you use without tagName you will get a document fragment
 * @example
 * document.body.appendChild(createElement({
  tagName: "div",
  className: "my-class",
  text: "Blah blah",
  attributes: {
    "id": "element id",
    "data-truc": "value"
  },
  childs: [{ `recursif call` }]
}))
 */
declare function createElement(params: createElementOpt);

/**
 * String start
 */

/**
 * Window Start
 */
// Add IE-specific interfaces to Window
interface Window {
  HTMLElement: HTMLElement;
  //user: user;
  /**
   * Opera navigator
   */
  readonly opera: string;
  dataLayer: [];
  mozRTCPeerConnection: any;

  attachEvent(event: string, listener: EventListener): boolean;

  detachEvent(event: string, listener: EventListener): void;

  [func: string]: any;

  gtag(message?: any, ...optionalParams: any[]): void;
}

interface Document
  extends Node,
  DocumentAndElementEventHandlers,
  DocumentOrShadowRoot,
  GlobalEventHandlers,
  NonElementParentNode,
  ParentNode,
  XPathEvaluatorBase {
  /**
   * window.addEventListener
   *
   * Appends an event listener for events whose type attribute value is type. The callback argument sets the callback
   * that will be invoked when the event is dispatched.
   *
   * The options argument sets listener-specific options. For compatibility this can be a boolean, in which case the
   * method behaves exactly as if the value was specified as options's capture.
   */
  attachEvent: any;

  /**
   * See {@see Document.addEventListener}
   */
  listen<K extends keyof DocumentEventMap>(
    type: K,
    listener: (this: Document, ev: DocumentEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  listen(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeListener<K extends keyof DocumentEventMap>(
    type: K,
    listener: (this: Document, ev: DocumentEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
  removeListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
}
