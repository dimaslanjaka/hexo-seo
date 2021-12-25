export = MapChanges;
declare function MapChanges(): void;
declare class MapChanges {
    getAllMapChangeDescriptors(): any;
    getMapChangeDescriptor(token: any): any;
    addMapChangeListener(listener: any, token: any, beforeChange: any): () => void;
    dispatchesMapChanges: boolean | undefined;
    removeMapChangeListener(listener: any, token: any, beforeChange: any): void;
    dispatchMapChange(key: any, value: any, beforeChange: any): void;
    addBeforeMapChangeListener(listener: any, token: any): () => void;
    removeBeforeMapChangeListener(listener: any, token: any): void;
    dispatchBeforeMapChange(key: any, value: any): void;
}
