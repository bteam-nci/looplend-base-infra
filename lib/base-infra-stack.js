const { Stack, CfnOutput } = require('aws-cdk-lib')
const dynamodb = require('aws-cdk-lib/aws-dynamodb')
const s3 = require('aws-cdk-lib/aws-s3')
const route53 = require('aws-cdk-lib/aws-route53')
const certificatemanager = require('aws-cdk-lib/aws-certificatemanager')
const cloudfront = require('aws-cdk-lib/aws-cloudfront')
const { generateName, generateDomainName } = require('../utils/naming')
const {
    ViewerProtocolPolicy,
} = require('aws-cdk-lib/aws-cloudfront/lib/distribution')

class BaseInfraStack extends Stack {
    constructor(scope, id, props) {
        super(scope, id, props)
        // dynamodb
        const dbTable = new dynamodb.Table(this, 'looplend-database', {
            tableName: generateName(props, 'looplend-database'),
        })
        // domain and routes
        const hostedZone = new route53.HostedZone(this, 'looplend-domain', {
            zoneName: 'looplend.it',
        })
        // cdn and websites buckets
        const platformWebsiteBucket = new s3.Bucket(this, 'looplend-website', {
            bucketName: generateDomainName(props, 'www'),
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'index.html',
        })

        const certificate =
            new certificatemanager.Certificate.fromCertificateArn(
                this,
                'looplend-certificate',
                'arn:aws:acm:us-east-1:925477059004:certificate/db600042-db8b-4891-92b8-d2e4ee6e3cd0'
            )
        const cdn = new cloudfront.CloudFrontWebDistribution(
            this,
            'looplend-cdn',
            {
                viewerCertificate:
                    cloudfront.ViewerCertificate.fromAcmCertificate(
                        certificate
                    ),
                viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                originConfigs: [
                    {
                        s3OriginSource: {
                            s3BucketSource: platformWebsiteBucket,
                        },
                        behaviors: [{ isDefaultBehavior: true }],
                    },
                ],
            }
        )

        // outputs
        new CfnOutput(this, 'looplend-database-name', {
            value: dbTable.tableName,
        })
        new CfnOutput(this, 'looplend-database-arn', {
            value: dbTable.tableArn,
        })
        new CfnOutput(this, 'looplend-domain-name', {
            value: hostedZone.zoneName,
        })
        new CfnOutput(this, 'looplend-website-bucket-name', {
            value: platformWebsiteBucket.bucketName,
        })
        new CfnOutput(this, 'looplend-cdn-domain-name', {
            value: cdn.distributionDomainName,
        })
        new CfnOutput(this, 'looplend-hosted-zone', {
            value: hostedZone.hostedZoneId,
        })
    }
}

module.exports = { BaseInfraStack }
