"use strict";
/* eslint-disable no-undef */
function imagebroker() {
    const images = document.querySelectorAll("img");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInNvdXJjZS9pbWFnZXMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDZCQUE2QjtBQUU3QixTQUFTLFdBQVc7SUFDbEIsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hELEtBQUssSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ2xELE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxQixHQUFHLENBQUMsT0FBTyxHQUFHO1lBQ1osb0NBQW9DO1FBQ3RDLENBQUMsQ0FBQztLQUNIO0FBQ0gsQ0FBQztBQUNEOzs7OztHQUtHO0FBQ0gsU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLE1BQU07SUFDMUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDM0Isd0JBQXdCO0FBQzFCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xuXG5mdW5jdGlvbiBpbWFnZWJyb2tlcigpIHtcbiAgY29uc3QgaW1hZ2VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKTtcbiAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGltYWdlcy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICBjb25zdCBpbWcgPSBpbWFnZXNbaW5kZXhdO1xuICAgIGltZy5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gdG9kbzogZ2V0IGNvbmZpZyBkZWZhdWx0IGZhbGxiYWNrXG4gICAgfTtcbiAgfVxufVxuLyoqXG4gKiBJbWFnZSBsb2FkIGVycm9yIGNhbGxiYWNrXG4gKiBAcGFyYW0ge0hUTUxJbWFnZUVsZW1lbnR9IF90aGlzXG4gKiBAcGFyYW0ge2FueX0gc3RhdHVzXG4gKiBAc2VlIHtAbGluayBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNDk0ODczMzF9XG4gKi9cbmZ1bmN0aW9uIGVycm9yKF90aGlzLCBzdGF0dXMpIHtcbiAgY29uc29sZS5sb2coX3RoaXMsIHN0YXR1cyk7XG4gIC8vIGRvIHlvdXIgd29yayBpbiBlcnJvclxufVxuIl19