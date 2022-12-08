import Hexo, { Model } from "hexo";
import moment from "moment";

interface objectCategoryTags {
  permalink: string;
  name: string;
  latest: string;
}
interface returnCategoryTags {
  tags: objectCategoryTags[];
  categories: objectCategoryTags[];
}
function getCategoryTags(hexo: Hexo) {
  const groups = ["categories", "tags"];
  const locals = hexo.locals;
  const groupfilter: returnCategoryTags = {
    tags: [],
    categories: []
  };
  if (!locals) {
    return groupfilter;
  }
  groups.map((group) => {
    const lastModifiedObject = (<Model<Hexo.Locals.Category | Hexo.Locals.Tag>>locals.get(group)).map((items) => {
      if (items.posts) {
        const archives = <Hexo.Locals.Category | Hexo.Locals.Tag>items;
        const posts = archives.posts;
        const latest = getLatestFromArrayDates(
          posts.map((post) => {
            return post.updated.toDate();
          })
        );
        const permalink = new URL(hexo.config.url);
        permalink.pathname = archives.path;

        return <objectCategoryTags>{
          permalink: permalink.toString(),
          name: archives.name,
          latest: moment(latest).format("YYYY-MM-DDTHH:mm:ssZ")
        };
      }
    });
    groupfilter[group] = lastModifiedObject;
  });
  return groupfilter;
}

/**
 * get latest date from array of date
 * @param arr
 * @returns
 */
export function getLatestFromArrayDates(arr: string[] | Date[]) {
  return new Date(
    Math.max.apply(
      null,
      arr.map(function (e: string | Date) {
        return e instanceof Date ? e : moment(e).toDate();
      })
    )
  );
}

export default getCategoryTags;
