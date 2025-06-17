function imagebroker() {
  const images = document.querySelectorAll('img');
  for (let index = 0; index < images.length; index++) {
    const img = images[index];
    img.onerror = function () {
      // todo: get config default fallback
    };
  }
}

/**
 * Image load error callback
 * @param {HTMLImageElement} _this
 * @param {any} status
 * @see {@link https://stackoverflow.com/a/49487331}
 */
function error(_this, status) {
  console.log(_this, status);
  // do your work in error
}
