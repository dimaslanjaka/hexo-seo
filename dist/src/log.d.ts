interface Consoler extends Console {
    olog: (...any: any[]) => void;
    prepend: (value: string) => any;
}
declare const logger: Consoler;
export default logger;
