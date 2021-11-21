/** SCHEDULER JOB **/
/*** Postpone executing functions ***/
declare class scheduler {
    /**
     * Add function with key to list
     * @param key
     * @param value
     */
    static add(key: string, value: () => any): void;
    /**
     * Execute functon in key and delete
     * @param key
     */
    static execute(key: string, deleteAfter?: boolean): void;
    /**
     * Execute all function lists
     */
    static executeAll(): void;
    /**
     * Clear Array
     * @param array
     */
    private static clearArray;
}
export default scheduler;
