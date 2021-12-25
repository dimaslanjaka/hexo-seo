export = PropertyChanges;
declare function PropertyChanges(): void;
declare class PropertyChanges {
    getOwnPropertyChangeDescriptor(key: any): any;
    hasOwnPropertyChangeDescriptor(key: any): boolean;
    addOwnPropertyChangeListener(key: any, listener: any, beforeChange: any): () => void;
    addBeforeOwnPropertyChangeListener(key: any, listener: any): any;
    removeOwnPropertyChangeListener(key: any, listener: any, beforeChange: any): void;
    removeBeforeOwnPropertyChangeListener(key: any, listener: any): any;
    dispatchOwnPropertyChange(key: any, value: any, beforeChange: any): void;
    dispatchBeforeOwnPropertyChange(key: any, listener: any): any;
    makePropertyObservable(key: any): void;
}
declare namespace PropertyChanges {
    const debug: boolean;
    function ObjectChangeDescriptor(): void;
    namespace prototype {
        namespace removeOwnPropertyChangeListener {
            export { ListenerGhost };
        }
        namespace dispatchOwnPropertyChange {
            export { dispatchEach };
        }
    }
    function getOwnPropertyChangeDescriptor(object: any, key: any): any;
    function hasOwnPropertyChangeDescriptor(object: any, key: any): any;
    function addOwnPropertyChangeListener(object: any, key: any, listener: any, beforeChange: any): any;
    function removeOwnPropertyChangeListener(object: any, key: any, listener: any, beforeChange: any): any;
    function dispatchOwnPropertyChange(object: any, key: any, value: any, beforeChange: any): any;
    function addBeforeOwnPropertyChangeListener(object: any, key: any, listener: any): any;
    function removeBeforeOwnPropertyChangeListener(object: any, key: any, listener: any): any;
    function dispatchBeforeOwnPropertyChange(object: any, key: any, value: any): any;
    function makePropertyObservable(object: any, key: any): any;
}
declare var ListenerGhost: any;
declare function dispatchEach(listeners: any, key: any, value: any, object: any): void;
declare namespace dispatchEach {
    export { ListenerGhost };
}
