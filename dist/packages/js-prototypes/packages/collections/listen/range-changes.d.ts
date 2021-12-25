export = RangeChanges;
declare function RangeChanges(): void;
declare class RangeChanges {
    getAllRangeChangeDescriptors(): any;
    getRangeChangeDescriptor(token: any): any;
    addRangeChangeListener(listener: any, token: any, beforeChange: any): () => void;
    dispatchesRangeChanges: boolean | undefined;
    removeRangeChangeListener(listener: any, token: any, beforeChange: any): void;
    dispatchRangeChange(plus: any, minus: any, index: any, beforeChange: any): void;
    addBeforeRangeChangeListener(listener: any, token: any): () => void;
    removeBeforeRangeChangeListener(listener: any, token: any): void;
    dispatchBeforeRangeChange(plus: any, minus: any, index: any): void;
}
