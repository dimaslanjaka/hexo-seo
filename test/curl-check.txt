import check from '../curl/check';

(async () => {
  console.log(await check('http://google.com')); // true
  console.log(
    await check(
      'https://www.digitalponsel.com/wp-content/uploads/2018/09/xOnePlus-6-1024x538.jpg.pagespeed.ic.zkfkebn_T3.jpg'
    )
  ); // false
})();
