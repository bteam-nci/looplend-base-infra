#!/usr/bin/env node

import cdk from 'aws-cdk-lib'
import BaseInfraStack from '../lib/base-infra-stack.js'

const app = new cdk.App()
const env  = { account: '925477059004', region: 'eu-west-1' };

new BaseInfraStack(app, `looplend-base`, {
    env
})
