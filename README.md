## CloudFront Signer

Sign urls with [canned or custom policy](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-signed-urls.html)

```js
// canned:
const cfSign = require('cloudfront-signer');

const url = 'http://xyz.cloudfront.net/test/cool?fun=1';
const signedUrl = url + '&' + cfSign(url, new Date(Date.now()+86400e3), cfKeypairId, cfPrivateKey)
```


```js
// custom (allow wildcards):
const cfSign = require('cloudfront-signer');

const qs = cfSign('http://xyz.cloudfront.net/test/*', new Date(Date.now()+86400e3), cfKeypairId, cfPrivateKey)
// valid for 'http://xyz.cloudfront.net/test/test/bar' + qs
// valid for 'http://xyz.cloudfront.net/test/test/cool?fun=1&' + qs
```