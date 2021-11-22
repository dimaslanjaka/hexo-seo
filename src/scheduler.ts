/** SCHEDULER JOB **/
/*** Postpone executing functions ***/

const functions: { [key: string]: () => any }[] = [];
class scheduler {
  /**
   * Add function with key to list
   * @param key
   * @param value
   */
  static add(key: string, value: () => any) {
    functions[key] = value;
  }
  private static postponeCounter = 0;
  /**
   * Add function to postpone, the functions will be executed every 5 items added
   */
  static postpone(key: string, value: () => any) {
    functions[key] = value;
    scheduler.postponeCounter += 1;
    if (scheduler.postponeCounter == 5) {
      scheduler.executeAll();
      scheduler.postponeCounter = 0;
    }
  }
  /**
   * Execute functon in key and delete
   * @param key
   */
  static execute(key: string, deleteAfter = true) {
    if (typeof functions[key] == "function") {
      functions[key]();
      if (deleteAfter) delete functions[key];
    } else {
      console.error(`function with key: ${key} is not function`);
    }
  }
  /**
   * Execute all function lists
   */
  static executeAll() {
    Object.keys(functions).forEach((key) => {
      console.log("executing", key);
      functions[key]();
    });
    scheduler.clearArray(functions);
  }

  /**
   * Clear Array
   * @param array
   */
  private static clearArray(array: any[]) {
    while (array.length) {
      array.pop();
    }
  }
}

export default scheduler;
