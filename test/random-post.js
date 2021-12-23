const { existsSync, mkdirSync, writeFileSync, rmSync } = require("fs");
const { join } = require("path");
const yaml = require("yaml");
const moment = require("moment");
require("js-prototypes/dist/libs/globals");

const countArticle = 1000;
const posts = Array.from(Array(countArticle).keys()).map((n) => {
  const created = randomDate(new Date(2012, 0, 1), new Date());
  const updated = randomDate(new Date(2012, 0, 1), created);
  const current = n + 1;
  return {
    title: "Post " + current,
    date: created,
    tags: ["random post", current.toString().includes("5") ? "post has 5" : "untagged"].removeEmpties(),
    category: ["random post", current.toString().includes("0") ? "post has 0" : "uncategorized"].removeEmpties(),
    updated: updated,
    content: "This is content of post " + current,
    filename: "post-" + current + ".md"
  };
});
const sourceDir = join(__dirname, "demo/source/_posts/random");
if (existsSync(sourceDir)) rmSync(sourceDir, { recursive: true, force: true });
if (!existsSync(sourceDir)) mkdirSync(sourceDir, { recursive: true });
posts.forEach((post) => {
  post.date = moment(post.date).format("YYYY-MM-DDTHH:mm:ssZ");
  post.updated = moment(post.updated).format("YYYY-MM-DDTHH:mm:ssZ");
  const content = post.content;
  const filepath = join(sourceDir, post.filename);
  delete post.content;
  delete post.filename;
  const header = yaml.stringify(post);
  const build = `---\n${header}---\n${content}`;
  writeFileSync(filepath, build);
});

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
