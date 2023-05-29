#!/usr/bin/env node

import cdk from 'aws-cdk-lib'
import BaseInfraStack from '../lib/base-infra-stack.js'

const app = new cdk.App()
new BaseInfraStack(app, `looplend-base`, {
    env: {
        region: 'eu-west-1',
    },
})
