import { CfnOutput, Stack, aws_s3, aws_route53 } from 'aws-cdk-lib'
import { generateCdn } from './cdn.js'

class BaseInfraStack extends Stack {
    constructor(scope, id, props) {
        super(scope, id, props)
        // domain and routes
        const hostedZone = new aws_route53.HostedZone(this, 'looplend-domain', {
            zoneName: 'looplend.it',
        })
        // cdn and websites buckets
        const prodWebsiteBucket = new aws_s3.Bucket(this, 'looplend-website', {
            bucketName: 'www.looplend.it',
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'index.html',
        })
        const devWebsiteBucket = new aws_s3.Bucket(
            this,
            'looplend-website-dev',
            {
                bucketName: 'dev.looplend.it',
                websiteIndexDocument: 'index.html',
                websiteErrorDocument: 'index.html',
            }
        )
        generateCdn(this, props)
        // outputs
        new CfnOutput(this, 'looplend-domain-name', {
            value: hostedZone.zoneName,
        })
        new CfnOutput(this, 'looplend-hosted-zone', {
            value: hostedZone.hostedZoneId,
        })
    }
}

export default BaseInfraStack
