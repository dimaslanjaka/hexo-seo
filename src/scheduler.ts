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
      functions[key]();
    });
    this.clearArray(functions);
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
