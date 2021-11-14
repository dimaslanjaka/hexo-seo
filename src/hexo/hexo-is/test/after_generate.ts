/* eslint-disable prefer-rest-params */
import hexoIs, { hexoIsDump } from "../";

export default function () {
  if (this.page) hexoIs(this);
  hexoIsDump(this);
  hexoIsDump(this.render, "render");
  hexoIsDump(this.view, "view");
}
