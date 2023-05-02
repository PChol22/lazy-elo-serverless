import { getCdkHandlerPath } from '@swarmion/serverless-helpers';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

import { sharedCdkEsbuildConfig } from '@elo/serverless-configuration';

import { burstContract } from 'contracts';

type BurstProps = { restApi: RestApi };

export class Burst extends Construct {
  public burstFunction: NodejsFunction;

  constructor(scope: Construct, id: string, { restApi }: BurstProps) {
    super(scope, id);

    this.burstFunction = new NodejsFunction(this, 'Lambda', {
      entry: getCdkHandlerPath(__dirname),
      handler: 'main',
      runtime: Runtime.NODEJS_16_X,
      architecture: Architecture.ARM_64,
      awsSdkConnectionReuse: true,
      bundling: sharedCdkEsbuildConfig,
      environment: {
        BASE_URL: restApi.url,
      },
    });

    restApi.root
      .resourceForPath(burstContract.path)
      .addMethod(
        burstContract.method,
        new LambdaIntegration(this.burstFunction),
      );
  }
}
