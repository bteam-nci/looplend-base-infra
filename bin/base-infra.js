#!/usr/bin/env node

const cdk = require('aws-cdk-lib')
const { BaseInfraStack } = require('../lib/base-infra-stack')

const app = new cdk.App()
const stage = app.node.tryGetContext('stage')
if (!stage || stage.trim() === '')
    throw new Error("Must pass a '-c stage=<stage>' context parameter")
new BaseInfraStack(app, `${stage}-looplend-base`, {
    stage,
})
