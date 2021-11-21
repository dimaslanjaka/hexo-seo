/** SCHEDULER JOB **/
/*** Postpone executing functions ***/
declare class scheduler {
    static add(key: string, value: () => any): void;
    static execute(key: string): void;
    static executeAll(): void;
}
export default scheduler;
