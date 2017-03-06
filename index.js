const crypto = require('crypto');
const QS = require('querystring').stringify;

const normalizeBase64 = str => str
	.replace(/\+/g, '-')
	.replace(/\//g, '~')
	.replace(/=/g, '_');


/** CloudFront url signer

initialize by calling it with cloudfront settings {cfUrl, cfKeypairId, cfPrivateKey}
// const cfSignedUrl = require('cloudfront-sign')(opts);

returns a signer function with args:
	- path: path in S3
	- expire: timestamp (in ms)
	- v: v querystring, optional, for invalidating cache

// cfSignedUrl('foo/bar', Date.now()+2*86400e3)
*/
module.exports = ({cfUrl, cfKeypairId, cfPrivateKey}) => 
	function cfSignedUrl(path, expireTime, v='') {
		const expire = Math.round(expireTime/1000);
		const url = cfUrl + '/' + path;
		const policy = JSON.stringify({
			'Statement': [{
				'Resource': url + '?v='+v,
				'Condition': {
					'DateLessThan': {
						'AWS:EpochTime': expire
					}
				}
			}]
		}); // ipRange not included
		
		const signature = crypto.createSign('RSA-SHA1').update(policy).sign(cfPrivateKey, 'base64');
		const policyStr = Buffer.from(policy).toString('base64');
		return url +'?' + QS({
			v,
			'Expires': expire,
			'Policy': normalizeBase64(policyStr),
			'Signature': normalizeBase64(signature),
			'Key-Pair-Id': cfKeypairId
		});
	}


