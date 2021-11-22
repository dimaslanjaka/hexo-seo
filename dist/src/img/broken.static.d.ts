import { _JSDOM } from "../html/dom";
import { HexoSeo } from "../html/schema/article";
import { imgOptions } from "./index.old";
import Promise from "bluebird";
export default function (dom: _JSDOM, HSconfig: imgOptions, data: HexoSeo): Promise<(Element | globalThis.Promise<void>)[]>;
