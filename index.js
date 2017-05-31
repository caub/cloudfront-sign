const crypto = require('crypto');
const QS = require('querystring').stringify;

const normalizeBase64 = str => str
	.replace(/\+/g, '-')
	.replace(/\//g, '~')
	.replace(/=/g, '_');


// http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-signed-urls.html

/** CloudFront url signer

	- url: cloudfront origin + path in S3 for the resource
	- expires: expire UNIX time in seconds
	- keypairId: CloudFront key-pair-id
	- privateKey: CloudFront certificate as ascii string ( fs.readFileSync(path.resolve('./cloudfront.pem')).toString('ascii') )
	- custom: flag to sign with Custom policy (defaults to =url.endsWith('*'))

	returns query string to be appended to a url again (must be the url in argument for a Canned url (default), or anything matching wildcard for a Custom)

*/
module.exports = function cfSign(url, time, keypairId, privateKey, custom=url.endsWith('*')) { // todo 3 last in an obj
	
	// const url = cfUrl + '/' + path;
	const policyStr = JSON.stringify({
		'Statement': [{
			'Resource': url,
			'Condition': {
				'DateLessThan': {
					'AWS:EpochTime': time
				}
			}
		}]
	});
	
	const signature = crypto.createSign('RSA-SHA1').update(policyStr).sign(privateKey, 'base64');

	return custom ? QS({
		'Expires': time,
		'Policy': normalizeBase64(Buffer.from(policyStr).toString('base64')),
		'Signature': normalizeBase64(signature),
		'Key-Pair-Id': keypairId
	}) : QS({
		'Expires': time,
		'Signature': normalizeBase64(signature),
		'Key-Pair-Id': keypairId
	});
};



