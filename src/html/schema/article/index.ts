import { CheerioAPI } from "cheerio";
import Hexo from "hexo";

const mainSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Extra! Extra! Read alla bout it",
  alternativeHeadline: "This article is also about robots and stuff",
  image: "http://example.com/image.jpg",
  author: {
    "@type": "Person",
    image: "/examples/jvanzweden_s.jpg",
    name: "Jaap van Zweden",
    sameAs: "http://www.jaapvanzweden.com/"
  },
  award: "Best article ever written",
  editor: "Craig Mount",
  genre: "search engine optimization",
  keywords: "seo sales b2b",
  wordcount: "1120",
  publisher: {
    "@type": "Organization",
    name: "Google",
    logo: {
      "@type": "ImageObject",
      url: "https://google.com/logo.jpg"
    }
  },
  url: "http://www.example.com",
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://google.com/article",
    mainEntity: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id":
        "https://developers.google.com/search/docs/advanced/structured-data/breadcrumb",
      name: "breadcrumb",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Books",
          item: "https://example.com/books"
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Authors",
          item: "https://example.com/books/authors"
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Ann Leckie",
          item: "https://example.com/books/authors/annleckie"
        }
      ]
    }
  },
  datePublished: "2015-09-20",
  dateCreated: "2015-09-20",
  dateModified: "2015-09-20",
  description: "We love to do stuff to help people and stuff",
  articleBody:
    "You can paste your entire post in here, and yes it can get really really long."
};

export type SchemaAuthor = ObjectConstructor & {
  image: string;
  name: string;
  sameAs?: string;
  url?: string;
};

export type HexoSeo = Hexo &
  Hexo.View &
  Hexo.Locals.Category &
  Hexo.Locals.Page &
  Hexo.Locals.Post &
  Hexo.Locals.Tag;

export interface SchemaArticleOptions {
  pretty?: boolean;
  hexo: HexoSeo;
}

class articleSchema {
  schema = mainSchema;
  options: SchemaArticleOptions;
  hexo: HexoSeo;
  constructor(options?: SchemaArticleOptions) {
    this.options = options;
    this.hexo = options.hexo;
  }

  /**
   * Set custom property and value
   * @param key
   * @param value
   */
  set(key: string, value: any) {
    this.schema[key] = value;
  }

  /**
   * Set breadcrumbs by tags and categories
   * @param tags
   */
  setBreadcrumbs(
    tags: {
      item: any;
      name: any;
    }[]
  ) {
    const build: typeof this.schema.mainEntityOfPage.mainEntity.itemListElement =
      [];
    for (let index = 0; index < tags.length; index++) {
      const template = {
        "@type": "ListItem",
        position: 0,
        name: "Books",
        item: "https://example.com/books"
      };
      const tag = tags[index];
      template.position = index + 1;
      template.name = tag.name;
      template.item = tag.item;
      build.push(template);
    }

    this.schema.mainEntityOfPage.mainEntity.itemListElement = build;
  }

  setUrl(url: string) {
    if (url) this.schema.url = url;
  }

  setDescription(description: string) {
    this.schema.alternativeHeadline = this.schema.description = description;
  }

  setImage($: string | CheerioAPI) {
    if (typeof $ === "string") {
      this.schema.image = $;
      return;
    }

    const images = $("img");
    for (let index = 0; index < images.length; index++) {
      const image = $(images[index]);
      const img = image.attr("src");
      if (img && img.trim().startsWith("#") && img.trim().length > 0) {
        if (/^\/|http?s/gs.test(img)) {
          this.schema.image = img;
          return;
        }
      }
    }

    this.schema.image =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/120px-No_image_available.svg.png";
  }

  /**
   * Set author
   * @param author Author Options
   */
  setAuthor(author: SchemaAuthor) {
    if (typeof author["author"] == "object") author = author["author"];

    //console.log(author);

    // determine author name
    let authorName = "Google";
    if (typeof author == "string") {
      // if author option is string as default hexo
      authorName = author;
    } else {
      // try search author names
      authorName = author["name"] || author["nick"] || author["nickname"];
      if (!authorName && typeof this.hexo.config.author != "undefined") {
        if (typeof this.hexo.config.author == "string") {
          authorName = this.hexo.config.author;
        } else if (typeof this.hexo.config.author == "object") {
          const findAuthorKey = ["name", "nick", "nickname"];
          for (const key in findAuthorKey) {
            if (Object.prototype.hasOwnProperty.call(findAuthorKey, key)) {
              if (typeof this.hexo.config.author[key] == "string")
                authorName = this.hexo.config.author[key];
            }
          }
        }
      }
      //author["config"]
    }
    this.schema.author.name =
      this.schema.publisher.name =
      this.schema.editor =
        authorName;

    // determine author image
    let authorImage =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png";
    if (author["image"]) {
      authorImage = author["image"];
    } else if (author["config"]) {
      if (author["config"]["image"]) {
        authorImage = author["config"]["image"];
      }
    }
    this.schema.author.image = this.schema.publisher.logo.url = authorImage;

    // determine author url
    let authorUrl = "https://webmanajemen.com";
    if (author["url"]) {
      authorUrl = author["url"];
    } else if (author["sameAs"]) {
      authorUrl = author["sameAs"];
    } else if (typeof this.hexo.config == "object") {
      if (typeof this.hexo.config.author == "object") {
        const propertyAuhorSearch = ["link", "url", "web", "website"];
        for (const key in propertyAuhorSearch) {
          if (Object.prototype.hasOwnProperty.call(propertyAuhorSearch, key)) {
            if (typeof propertyAuhorSearch[key] == "string") {
              authorUrl = propertyAuhorSearch[key];
              break;
            } else if (Array.isArray(propertyAuhorSearch[key])) {
              if (typeof propertyAuhorSearch[key][0] == "string") {
                authorUrl = propertyAuhorSearch[key];
                break;
              }
            }
          }
        }
      }
    }
    this.schema.author.sameAs = authorUrl;
  }

  /**
   * Set schema article title
   * @param title
   */
  setTitle(title: string) {
    this.schema.headline = title;
  }

  /**
   * Set schema article body/content
   * @param articleBody
   */
  setArticleBody(articleBody: string) {
    this.schema.wordcount = articleBody.trim().length.toString();
    this.schema.articleBody = articleBody.trim();
  }

  toString() {
    if (this.options.pretty) {
      return JSON.stringify(this.schema, null, 2);
    }
    return JSON.stringify(this.schema);
  }
}

export default articleSchema;
