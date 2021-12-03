export = md5File;
declare function md5File(path: any): Promise<any>;
declare namespace md5File {
    export { md5FileSync as sync };
}
import Promise = require("bluebird");
declare function md5FileSync(path: any): string;
