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
      if (img && img.length > 0) {
        if (/^\/|http?s/gs.test(img)) {
          this.schema.image = img;
          return;
        }
      }
    }
  }

  /**
   * Set author
   * @param author Author Options
   */
  setAuthor(author: SchemaAuthor) {
    if (typeof author["author"] == "object") author = author["author"];

    //console.log(author);

    // determine author name
    let authorName: string;
    if (typeof author == "string") {
      // if author option is string as default hexo
      authorName = author;
    } else {
      // try search author names
      authorName = author["name"] || author["config"]["name"] || "Google";
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
   * Set title
   * @param title
   */
  setTitle(title: string) {
    this.schema.headline = title;
    this.schema.keywords = title;
  }

  setArticleBody(articleBody: string) {
    this.schema.wordcount = articleBody.trim().length.toString();
  }

  toString() {
    if (this.options.pretty) {
      return JSON.stringify(this.schema, null, 2);
    }
    return JSON.stringify(this.schema);
  }
}

export default articleSchema;
