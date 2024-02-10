import { HexoLocalsData } from 'hexo/dist/hexo/locals-d';
import { HTMLElement } from 'node-html-parser';
import { BaseConfig } from '../config';
/**
 * Fix Schema Model 4
 * @param dom
 * @param hsConf hexo-seo config (config_yml.seo)
 * @param data
 */
export default function fixSchemaStatic(dom: HTMLElement, hsConf: BaseConfig, data: HexoLocalsData): void;
