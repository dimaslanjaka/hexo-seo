/* eslint-disable no-undef */
function imagebroker() {
    var images = document.querySelectorAll("img");
    for (var index = 0; index < images.length; index++) {
        var img = images[index];
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
