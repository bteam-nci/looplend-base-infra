import {
    CfnOutput,
    Stack,
    aws_s3,
    aws_route53,
    aws_route53_targets,
} from 'aws-cdk-lib'
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
        const cdn = generateCdn(this, prodWebsiteBucket)

        // dns records for frontend
        new aws_route53.ARecord(this, 'looplend-website-record', {
            zone: hostedZone,
            target: aws_route53.RecordTarget.fromAlias(
                new aws_route53_targets.CloudFrontTarget(cdn)
            ),
        })
        new aws_route53.ARecord(this, 'looplend-dev-website-record', {
            zone: hostedZone,
            target: aws_route53.RecordTarget.fromAlias(
                new aws_route53_targets.BucketWebsiteTarget(devWebsiteBucket)
            ),
        })
        // outputs
        new CfnOutput(this, 'looplend-dev-bucket', {
            value: devWebsiteBucket.bucketName,
        })
        new CfnOutput(this, 'looplend-prod-bucket', {
            value: prodWebsiteBucket.bucketName,
        })
        new CfnOutput(this, 'looplend-domain-name', {
            value: hostedZone.zoneName,
        })
        new CfnOutput(this, 'looplend-hosted-zone', {
            value: hostedZone.hostedZoneId,
        })
    }
}

export default BaseInfraStack
