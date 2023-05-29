import { aws_certificatemanager, aws_cloudfront, CfnOutput } from 'aws-cdk-lib'

export function generateCdn(stack, bucket) {
    const certificate = aws_certificatemanager.Certificate.fromCertificateArn(
        stack,
        'looplend-certificate',
        'arn:aws:acm:us-east-1:925477059004:certificate/db600042-db8b-4891-92b8-d2e4ee6e3cd0'
    )
    const cdn = new aws_cloudfront.CloudFrontWebDistribution(
        stack,
        'looplend-cdn',
        {
            viewerCertificate:
                aws_cloudfront.ViewerCertificate.fromAcmCertificate(
                    certificate
                ),
            viewerProtocolPolicy:
                aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: bucket,
                    },
                    behaviors: [{ isDefaultBehavior: true }],
                },
            ],
        }
    )
    new CfnOutput(this, 'looplend-cdn-domain-name', {
        value: cdn.distributionDomainName,
    })
}
