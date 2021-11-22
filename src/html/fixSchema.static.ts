import { ReturnConfig } from "../config";
import { trimText } from "../utils/string";
import schemaArticles, { HexoSeo, SchemaAuthor } from "./schema/article";
import { isDev } from "..";
import { getTextPartialHtml, _JSDOM } from "./dom";
import "../../packages/js-prototypes/src/String";
import "../../packages/js-prototypes/src/Array";
import underscore from "underscore";
import { dump, extractSimplePageData } from "../utils";

export default function (dom: _JSDOM, HSconfig: ReturnConfig, data: HexoSeo) {
  if (typeof HSconfig.schema === "boolean" && !HSconfig.schema) return;
  const Schema = new schemaArticles({ pretty: isDev, hexo: data });
  // set url
  let url = data.config.url;
  if (data.page) {
    if (data.page.permalink) {
      url = data.page.permalink;
    } else if (data.page.url) {
      url = data.page.url;
    }
  }
  if (url) Schema.setUrl(url);

  let keywords: string[] = [];
  if (data.config.keywords) {
    keywords = keywords.concat(data.config.keywords.split(",").map(trimText));
  }

  // set title
  const title = data.page.title || data.title || data.config.title;
  if (title) {
    keywords.push(title);
    Schema.setTitle(title);
  } else {
    //dump("dump-path0.txt", path0);
    dump("dump-data.txt", extractSimplePageData(data));
    dump("dump-page.txt", extractSimplePageData(data.page));
    dump("dump-data.txt", extractSimplePageData(this));
  }

  // set schema author
  let author: SchemaAuthor;
  if (data.page) {
    if (data.page["author"]) {
      author = data.page["author"];
    }
  } else if (data["author"]) {
    author = data["author"];
  }
  if (author) Schema.setAuthor(author);

  // set schema date
  if (data.page) {
    if (data.page.date) {
      Schema.set("dateCreated", data.page.date);
      Schema.set("datePublished", data.page.date);
    }
    if (data.page.modified) {
      Schema.set("dateModified", data.page.modified);
    } else if (data.page.updated) {
      Schema.set("dateModified", data.page.updated);
    }
  }

  // set schema body
  let body: string;
  if (data.page) {
    if (data.page.content) {
      const getText = getTextPartialHtml(data.page.content);
      body = getText;
      if (!body || body.trim().length === 0) {
        console.log("getText failed");
        body = data.page.content.replace(/[\W_-]+/gm, " ");
      }
    }
  } else if (data.content) {
    body = data.content;
  }
  if (body) {
    body = underscore.escape(
      body
        .trim()
        //.replace(/['“"{}\\”]+/gm, "")
        .replace(/https?:\/\//gm, "//")
    );
    Schema.setArticleBody(body);
    // set schema description
    Schema.setDescription(body.trim().substring(0, 150));
  }

  // set schema description
  /*let description = title;
  if (data.page) {
    if (data.page.description) {
      description = data.page.description;
    } else if (data.page.desc) {
      description = data.page.desc;
    } else if (data.page.subtitle) {
      description = data.page.subtitle;
    } else if (data.page.excerpt) {
      description = data.page.excerpt;
    }
  }
  if (description)
    Schema.setDescription(description.replace(/[\W_-]+/gm, " ").trim());*/

  // prepare breadcrumbs
  const schemaBreadcrumbs = [];
  if (data.page) {
    if (data.page.tags && data.page.tags.length > 0) {
      data.page.tags.forEach((tag, index, tags) => {
        keywords.push(tag["name"]);
        const o = { item: tag["permalink"], name: tag["name"] };
        schemaBreadcrumbs.push(<any>o);
      });
    }

    if (data.page.categories && data.page.categories.length > 0) {
      data.page.categories.forEach((category) => {
        keywords.push(category["name"]);
        const o = { item: category["permalink"], name: category["name"] };
        schemaBreadcrumbs.push(<any>o);
      });
    }
  }
  if (schemaBreadcrumbs.length > 0) {
    Schema.setBreadcrumbs(schemaBreadcrumbs);
  }

  // set schema image
  let img =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png";
  if (data.photos && Array.isArray(data.photos) && data.photos.length > 0) {
    img = data.photos[0];
  } else if (data.cover) {
    img = data.cover;
  }
  Schema.setImage(img);

  // set schema genres
  Schema.set(
    "genre",
    keywords.unique().removeEmpties().map(trimText).join(",")
  );
  Schema.set(
    "keywords",
    keywords.unique().removeEmpties().map(trimText).join(",")
  );
  Schema.set(
    "award",
    keywords.unique().removeEmpties().map(trimText).join(",")
  );

  const schemahtml = `<script type="application/ld+json">${Schema}</script>`;
  dom.document.head.insertAdjacentHTML("beforeend", schemahtml);
}
