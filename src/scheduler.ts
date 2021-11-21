/** SCHEDULER JOB **/
/*** Postpone executing functions ***/

const functions: { [key: string]: () => any }[] = [];
class scheduler {
  static add(key: string, value: () => any) {
    functions[key] = value;
  }
  static execute(key: string) {
    if (typeof functions[key] == "function") {
      functions[key]();
    } else {
      console.error(`function with key: ${key} is not function`);
    }
  }
  static executeAll() {
    Object.keys(functions).forEach((key) => {
      functions[key]();
    });
  }
}

export default scheduler;
