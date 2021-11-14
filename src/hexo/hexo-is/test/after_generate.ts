/* eslint-disable prefer-rest-params */
import hexoIs from "../";

export default function () {
  if (this.page) hexoIs(this);
  console.log(this);
}
