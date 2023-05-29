#!/usr/bin/env node

import cdk from 'aws-cdk-lib'

import { BaseInfraStack } from '../lib/base-infra-stack'

const app = new cdk.App()
const stage = app.node.tryGetContext('stage')
if (!stage || stage.trim() === '')
    throw new Error("Must pass a '-c stage=<stage>' context parameter")
new BaseInfraStack(app, `${stage}-looplend-base`, {
    stage,
})
