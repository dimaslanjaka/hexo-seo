import Hexo from 'hexo';
import moment from 'moment';

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
  const groups = ['categories', 'tags'];
  const locals = hexo.locals;
  const groupfilter: returnCategoryTags = {
    tags: [],
    categories: []
  };
  if (!locals) {
    return groupfilter;
  }
  groups.map((group) => {
    const lastModifiedObject = locals.get(group).map((items) => {
      if (items.posts) {
        const archives = items;
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
          latest: moment(latest).format('YYYY-MM-DDTHH:mm:ssZ')
        };
      }
    });
    groupfilter[group] = lastModifiedObject;
  });
  return groupfilter;
}

/**
 * Returns the latest date from an array of date strings or Date objects.
 *
 * @param {Array<string | Date>} arr - Array containing date strings or Date objects.
 * @returns {Date | null} The latest date found, or null if array is empty or invalid.
 */
export function getLatestFromArrayDates(arr: Array<string | Date>): Date | null {
  if (!Array.isArray(arr) || arr.length === 0) return null;

  const timestamps = arr
    .map((e) => {
      const date = e instanceof Date ? e : moment(e).toDate();
      return date?.getTime?.() ?? NaN;
    })
    .filter((time) => !isNaN(time));

  if (timestamps.length === 0) return null;

  return new Date(Math.max(...timestamps));
}

export default getCategoryTags;
