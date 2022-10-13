import through2 from "through2";

through2.obj((chunk) => {
  const content = typeof chunk.contents != 'undefined';
  console.log(content);
});