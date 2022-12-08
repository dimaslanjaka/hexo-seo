/// <reference types="node" />
import Hexo from "hexo";
export interface imgOptions {
    /**
     * exclude image patterns from optimization
     */
    exclude?: string[];
    /**
     * replace broken images with default ones
     */
    broken?: boolean | {
        string: string;
    }[];
    /**
     * default image fallback
     */
    default?: string | Buffer;
    onerror?: "serverside" | "clientside";
}
export default function (this: Hexo): Promise<void[]>;
