# LoopLend base infrastructure

This is a cdk project that holds:

-   the database (dynamo)
-   the hosted zones (route53)
-   the certificate (acm)
-   the distribution (cloudfront)

## Setup

Run `npm install`

## CI / CD

Every push to master will trigger a build and deploy to the dev environment.
Every push to a releases branch will push to the prod environment.
