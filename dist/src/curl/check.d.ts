/**
 * Check if url is exists
 */
declare const checkUrl: (url: string | URL) => Promise<{
    result: boolean;
    statusCode: any;
    data: any;
    headers: any;
}>;
export default checkUrl;
