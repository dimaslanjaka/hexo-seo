/* eslint-disable prefer-rest-params */
import hexoIs, { hexoIsDump } from "..";

export default function (content, data) {
  const is = hexoIs(data);
  console.log(is);
  //hexoIsDump(arguments, "after_render_html_args");
}
