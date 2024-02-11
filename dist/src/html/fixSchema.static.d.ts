import { HexoLocalsData } from 'hexo/dist/hexo/locals-d';
import { HTMLElement } from 'node-html-parser';
import { BaseConfig } from '../config';
/**
 * Fix Schema Model 4
 * @param dom
 * @param hexoSeoConfig hexo-seo config (config_yml.seo)
 * @param data
 */
export default function fixSchemaStatic(dom: HTMLElement, hexoSeoConfig: BaseConfig, data: HexoLocalsData): void;
