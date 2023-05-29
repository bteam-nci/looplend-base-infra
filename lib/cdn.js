import { aws_certificatemanager, aws_cloudfront, CfnOutput } from 'aws-cdk-lib'

export function generateCdn(stack, bucket) {
    const certificate = aws_certificatemanager.Certificate.fromCertificateArn(
        stack,
        'looplend-certificate',
        'arn:aws:acm:us-east-1:925477059004:certificate/4aafd06a-35ff-4a4f-bdda-e35a9f7970bd'
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
    new CfnOutput(stack, 'looplend-cdn-domain-name', {
        value: cdn.distributionDomainName,
    })
    return cdn
}
