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

export type SchemaAuthor = {
  image: string;
  name: string;
  sameAs?: string;
  url?: string;
};

export interface SchemaArticleOptions {
  pretty?: boolean;
}

class articleSchema {
  schema = mainSchema;
  options: SchemaArticleOptions = {};
  constructor(options?: SchemaArticleOptions) {
    this.options = options || {};
  }
  /**
   * Set author
   * @param author Author Options
   */
  setAuthor(author: SchemaAuthor | Hexo | Hexo.View) {
    if (author["author"]) author = author["author"];
    console.log(author);
    this.schema.author.name = this.schema.editor = author["name"] || "Google";
    this.schema.author.image =
      author["image"] ||
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png";
    this.schema.author.sameAs =
      author["url"] || author["sameAs"] || "https://google.com";
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
