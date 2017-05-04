## CloudFront Signer

Sign urls with [canned or custom policy](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-signed-urls.html)

```js

const cfSign = require('cloudfront-signer');

var signedUrl = url + '?' + cfSign(url, new Date(Date.now()+86400e3), cfKeypairId, cfPrivateKey)

```