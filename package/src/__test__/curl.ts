import { Curl } from 'node-libcurl';
const curlTest = new Curl();
const terminate = curlTest.close.bind(curlTest);

curlTest.setOpt(Curl.option.URL, 'https://reqres.in/api/users');
curlTest.on('end', function (statusCode, data, headers) {
  console.info('Status code ' + statusCode);
  console.info('***');
  console.info('Our response: ' + data);
  console.info('***');
  console.info('Length: ' + data.length);
  console.info('***');
  console.info('Total time taken: ' + this.getInfo('TOTAL_TIME'));

  this.close();
});
curlTest.on('error', terminate);
curlTest.perform();
