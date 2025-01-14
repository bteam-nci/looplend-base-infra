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

        const hostedZone = aws_route53.HostedZone.fromLookup(
            this,
            'looplend-hostedzone',
            { domainName: 'looplend.it' }
        )
        // cdn and websites buckets
        const prodWebsiteBucket = new aws_s3.Bucket(this, 'looplend-website', {
            bucketName: 'www.looplend.it',
            publicReadAccess: true,
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'index.html',
            blockPublicAccess: aws_s3.BlockPublicAccess.BLOCK_ACLS,
            accessControl: aws_s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
        })

        const cdn = generateCdn(this, prodWebsiteBucket)

        // dns records for frontend
        new aws_route53.ARecord(this, 'looplend-website-record', {
            zone: hostedZone,
            target: aws_route53.RecordTarget.fromAlias(
                new aws_route53_targets.CloudFrontTarget(cdn)
            ),
        })
        // outputs
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
