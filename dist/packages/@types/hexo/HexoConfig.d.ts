import Hexo from "./index";
interface HexoConfig {
  [key: string]: any;
  /**
   * The title of your website
   */
  readonly title: string;

  /**
   * The subtitle of your website
   */
  readonly subtitle: string;

  /**
   * The description of your website
   */
  readonly description: string;

  /*
   * Your name
   */
  readonly author: string;

  /**
   * The language of your website. Use a 2-lettter ISO-639-1 code. Default is en.
   */
  readonly language: string;

  /**
   * The timezone of your website. Hexo uses the setting on your computer by default.
   * You can find the list of available timezones [here]{@link https://en.wikipedia.org/wiki/List_of_tz_database_time_zones} .
   * Some examples are `America/New_York` , `Japan` , and `UTC` .
   */
  readonly timezone: string;

  /*
   * The URL of your website
   */
  readonly url: string;

  /**
   * The root directory of your website
   */
  readonly root: string;

  /**
   * The permalink format of articles
   */
  readonly permalink: string;

  /**
   * Default values of each segment in permalink
   */
  readonly permalink_defaults: string | null;

  /**
   * Source folder. Where your content is stored
   */
  readonly source_dir: string;

  /**
   * Public folder. Where the static site will be generated
   */
  readonly public_dir: string;

  /**
   * Tag directory
   */
  readonly tag_dir: string;

  /**
   * Archive directory
   */
  readonly archive_dir: string;

  /**
   * Category directory
   */
  readonly category_dir: string;

  /**
   * Include code directory (subdirectory of source_dir)
   */
  readonly code_dir: string;

  /**
   * i18n directory
   */
  readonly i18n_dir: string;

  /**
   * Paths that will be copied to public raw, without being rendered. You can use glob expressions for path matching.
   */
  readonly skip_render: string | string[] | null;

  /**
   * The filename format for new posts
   */
  readonly new_post_name: string;

  /**
   * Default layout
   */
  readonly default_layout: string;

  /**
   * Transform titles into title case?
   */
  readonly titlecase: boolean;

  /**
   * Open external links in a new tab?
   */
  readonly external_link: boolean;

  /**
   * Transform filenames to 1 lower case; 2 upper case
   */
  readonly filename_case: number;

  /**
   * Display drafts?
   */
  readonly render_drafts: boolean;

  /**
   * Enable the Asset Folder?
   */
  readonly post_asset_folder: boolean;

  /**
   * Make links relative to the root folder?
   */
  readonly relative_link: boolean;

  /**
   * Display future posts?
   */
  readonly future: boolean;

  /**
   * Code block settings
   */
  readonly highlight: {
    readonly enable: boolean;
    readonly line_number: boolean;
    readonly auto_detect: boolean;
    readonly tab_replace: string | null;
  };

  /**
   * Default category
   */
  readonly default_category: string;

  /**
   * Category slugs
   */
  readonly category_map: { [key: string]: string | number };

  /**
   * Tag slugs
   */
  readonly tag_map: { [key: string]: string | number };

  /**
   * Date format
   * https://momentjs.com/
   */
  readonly date_format: string;

  /**
   * Time format
   * https://momentjs.com/
   */
  readonly time_format: string;

  /**
   * The amount of posts displayed on a single page. 0 disables pagination
   */
  readonly per_page: number;

  /**
   * Pagination directory
   */
  readonly pagination_dir: string;

  /**
   * Theme name. false disables theming
   */
  readonly theme: string | false;

  /**
   * Theme configuration. Include any custom theme settings under this key to override theme defaults.
   */
  readonly theme_config: { [key: string]: string | number };

  /**
   * Deployment settings
   */
  readonly deploy:
  | Hexo.extend.Deployer.Config
  | Hexo.extend.Deployer.Config
  | null;

  /**
   * Hexo by default ignores hidden files and folders, but setting this field will make Hexo process them
   */
  readonly include?: string[] | undefined;

  /**
   * Hexo process will ignore files list under this field
   */
  readonly exclude?: string[] | undefined;
  readonly ignore: string[];
}

export = HexoConfig;