declare let Navigator: {
    prototype: Navigator;
    new(): Navigator;
};

interface NavigatorAutomationInformation {
    readonly webdriver: boolean;
}

interface NavigatorBeacon {
    sendBeacon(url: string, data?: Blob | Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array | DataView | ArrayBuffer | FormData | string | null): boolean;
}

interface NavigatorConcurrentHardware {
    readonly hardwareConcurrency: number;
}

interface NavigatorContentUtils {
    registerProtocolHandler(scheme: string, url: string, title: string): void;

    unregisterProtocolHandler(scheme: string, url: string): void;
}

interface NavigatorCookies {
    readonly cookieEnabled: boolean;
}

interface NavigatorID {
    readonly appCodeName: string;
    readonly appName: string;
    readonly appVersion: string;
    readonly oscpu: string;
    /**
     * Get platform name
     */
    readonly platform: string;
    readonly product: string;
    readonly productSub: string;
    /**
     * Get browser useragent
     */
    readonly userAgent: string;
    /**
     * Get browser vendor
     */
    readonly vendor: string;
    readonly vendorSub: string;

    taintEnabled(): boolean;
}

interface NavigatorLanguage {
    readonly language: string;
    readonly languages: ReadonlyArray<string>;
}

interface NavigatorOnLine {
    readonly onLine: boolean;
}

interface NavigatorPlugins {
    readonly mimeTypes: MimeTypeArray;
    readonly plugins: PluginArray;

    javaEnabled(): boolean;
}

interface NavigatorStorage {
    readonly storage: StorageManager;
}