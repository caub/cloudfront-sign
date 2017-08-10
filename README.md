## CloudFront Signer [![Build Status](https://travis-ci.org/caub/cloudfront-signer.svg?branch=master)](https://travis-ci.org/caub/cloudfront-signer)

Sign urls with [canned or custom policy](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-signed-urls.html)

**Notice**: Use aws-sdk library rather, this one was done before I knew about it, and inspired from aws-cloudfront-sign

```js
// canned:
const cfSign = require('cloudfront-signer');

const expire = Math.floor((Date.now()+86400e3)*0.001); // expire in one day
const url = 'http://xyz.cloudfront.net/test/cool?fun=1';
const signedUrl = url + '&' + cfSign(url, expire, cfKeypairId, cfPrivateKey)
```


```js
// custom (allow wildcards):
const cfSign = require('cloudfront-signer');

const expire = Math.floor((Date.now()+86400e3)*0.001); // expire in one day
const qs = cfSign('http://xyz.cloudfront.net/test/*', expire, cfKeypairId, cfPrivateKey)
// valid for 'http://xyz.cloudfront.net/test/test/bar?' + qs
// valid for 'http://xyz.cloudfront.net/test/test/cool?fun=1&' + qs
```