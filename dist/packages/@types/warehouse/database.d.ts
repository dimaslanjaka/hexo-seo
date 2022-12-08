export = Database;

interface DatabaseOptions {
  /**
   * Database version
   * * default 0
   */
  version: number;
  /** Database path */
  path: string;
  /** Triggered when the database is upgraded */
  onUpgrade: CallableFunction;
  /** Triggered when the database is downgraded */
  onDowngrade: CallableFunction;
}

declare class Database {
  /**
   * Database constructor.
   */
  constructor(data: DatabaseOptions);

  /**
   * Creates a new model.
   *
   * @param {string} name
   * @param {Schema|object} [schema]
   * @return {Model}
   */
  model(name: string, schema?: Schema | object): Model;
  /**
   * Loads database.
   *
   * @param {function} [callback]
   * @return {Promise}
   */
  load(callback?: CallableFunction): Promise<any>;
  /**
   * Saves database.
   *
   * @param {function} [callback]
   * @return {Promise}
   */
  save(callback?: CallableFunction): Promise<any>;
  toJSON(): {
    meta: {
      version: any;
      warehouse: any;
    };
    models: Model;
  };
  Schema: typeof Schema;
  SchemaType: typeof SchemaType;
}

import Schema_1 from './schema';
import SchemaType_1 from './schematype';

declare namespace Database {
  export { Schema_1 as Schema };
  export { SchemaType_1 as SchemaType };
  export const version: any;
}

import Model from './model';
import Schema from './schema';
import SchemaType from './schematype';
//# sourceMappingURL=database.d.ts.map
