const crypto = require('crypto');
const QS = require('querystring').stringify;

const normalizeBase64 = str => str
	.replace(/\+/g, '-')
	.replace(/\//g, '~')
	.replace(/=/g, '_');


// http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-signed-urls.html

module.exports = cfSign;

/** CloudFront url signer

	- url: cloudfront origin + path in S3 for the resource
	- expires: timestamp (in ms) or Date
	- keypairId: CloudFront key-pair-id
	- privateKey: CloudFront certificate as ascii string ( fs.readFileSync(path.resolve('./cloudfront.pem')).toString('ascii') )

	returns query string to be appended to a url again (must be the url in argument for a Canned url (default), or anything matching wildcard for a Custom)

*/
function cfSign(url, expires, keypairId, privateKey) { // could do {url, ex..}  later, to avoid position errors

	const time = Math.floor(expires/1000); // to unix
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

	return QS({
		'Expires': time,
		// 'Policy': normalizeBase64(Buffer.from(policyStr).toString('base64')), // not necessary for canned policy, necessary if using resource wildcards *
		'Signature': normalizeBase64(signature),
		'Key-Pair-Id': keypairId
	});
};


cfSign.canned = cfSign;

cfSign.custom = function cfCustomSign(url, expires, keypairId, privateKey) {

	const time = Math.floor(expires/1000); // to unix

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

	return QS({
		'Expires': time,
		'Policy': normalizeBase64(Buffer.from(policyStr).toString('base64')),
		'Signature': normalizeBase64(signature),
		'Key-Pair-Id': keypairId
	});
};



