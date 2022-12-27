import { TemplateLocals } from "hexo";
import hexoIs from "hexo-is";
import moment from "moment-timezone";
import { HTMLElement } from "node-html-parser";
import { BaseConfig } from "../config";
import log from "../log";
import model from "./schema/article/model4.json";

/**
 * Fix Schema Model 4
 * @param dom
 * @param HSconfig
 * @param data
 */
export default function fixSchemaStatic(dom: HTMLElement, HSconfig: BaseConfig, data: TemplateLocals) {
  if (!HSconfig.schema) {
    return;
  }
  const is = hexoIs(data);
  const breadcrumbs = model[0];
  const article = model[1];
  const sitelink = model[2];
  // resolve title
  let title = "";
  if (data.page && data.page.title && data.page.title.trim().length > 0) {
    title = data.page.title;
  } else {
    title = data.config.title;
  }
  // resolve description
  let description = title;
  if (data.page.description) {
    description = data.page.description;
  } else if (data.page.subtitle) {
    description = data.page.subtitle;
  }
  // resolve url
  let url = data.config.url;
  if (data.page) {
    if (data.page.permalink) {
      url = data.page.permalink;
    } else if (data.page.url) {
      url = data.page.url;
    }
  }

  // resolve thumbnail
  let thumbnail =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png";
  if (data.page) {
    const photos = Array.isArray(data.page.photos) ? data.page.photos[0] : null;
    const cover = data.page.cover || data.page.thumbnail;
    if (cover) {
      thumbnail = cover;
    } else if (photos) {
      thumbnail = photos;
    }
  }

  // resolve author
  let author = data.config.author;
  if (data.page) {
    if (data.page.author) {
      author = data.page.author;
    }
  }

  const schema = [];

  // setup schema sitelink
  if (HSconfig.schema.sitelink && HSconfig.schema.sitelink.searchUrl) {
    sitelink.url = data.config.url;
    sitelink.potentialAction.target = HSconfig.schema.sitelink.searchUrl;
    schema.push(sitelink);
  }

  if (is.post) {
    // setup breadcrumb on post
    if (HSconfig.schema.breadcrumb?.enable) {
      const schemaBreadcrumbs: typeof breadcrumbs.itemListElement = [];
      if (data.page) {
        if (data.page.tags && data.page.tags.length > 0) {
          data.page.tags.forEach((tag) => {
            const o = {
              "@type": "ListItem",
              position: schemaBreadcrumbs.length + 1,
              item: tag["permalink"],
              name: tag["name"]
            };
            schemaBreadcrumbs.push(o);
          });
        }

        if (data.page.categories && data.page.categories.length > 0) {
          data.page.categories.forEach((category) => {
            const o = {
              "@type": "ListItem",
              position: schemaBreadcrumbs.length + 1,
              item: category["permalink"],
              name: category["name"]
            };
            schemaBreadcrumbs.push(<any>o);
          });
        }

        schemaBreadcrumbs.push({
          "@type": "ListItem",
          position: schemaBreadcrumbs.length + 1,
          item: url,
          name: title
        });
      }

      if (schemaBreadcrumbs.length > 0) {
        breadcrumbs.itemListElement = schemaBreadcrumbs;
        schema.push(breadcrumbs);
      }
    }

    if (HSconfig.schema.article?.enable) {
      article.mainEntityOfPage["@id"] = url;
      article.headline = title;
      article.description = description;
      article.image.url = thumbnail;
      article.author.name = author;
      article.publisher.name = author;
      article.dateModified = moment(new Date(String(data.page.updated)))
        .tz(data.config.timezone || "UTC")
        .format();
      article.datePublished = moment(new Date(String(data.page.date)))
        .tz(data.config.timezone || "UTC")
        .format();
      schema.push(article);
    }
  }

  if (schema.length > 0) {
    const JSONschema = JSON.stringify(schema, null, 2);
    const schemahtml = `\n\n<script type="application/ld+json" id="hexo-seo-schema">${JSONschema}</script>\n\n`;
    log.log("schema created", title, url);

    if (schemahtml) {
      const head = dom.getElementsByTagName("head")[0];
      head.insertAdjacentHTML("beforeend", schemahtml);
    }
  }
}
