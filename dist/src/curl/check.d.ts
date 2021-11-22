/**
 * Check if url is exists
 */
declare const checkUrl: (url: string | URL) => Promise<boolean | {
    result: boolean;
    statusCode: number;
    data: any;
    headers: import("node-libcurl").HeaderInfo[];
}>;
export default checkUrl;
