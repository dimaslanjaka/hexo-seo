import Promise from "bluebird";
/**
 * Check if url is exists
 */
declare const checkUrl: (url: string | URL) => Promise<{
    result: boolean;
    statusCode: number;
    data: any;
    headers: import("node-libcurl").HeaderInfo[];
}> | {
    result: boolean;
    statusCode: any;
    data: any;
    headers: any;
};
export default checkUrl;
