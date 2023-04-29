import { getCdkHandlerPath } from '@swarmion/serverless-helpers';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

import { sharedCdkEsbuildConfig } from '@elo/serverless-configuration';

import { addPlayerContract } from 'contracts';

type AddPlayerProps = { restApi: RestApi; table: Table };

export class AddPlayer extends Construct {
  public addPlayerFunction: NodejsFunction;

  constructor(
    scope: Construct,
    id: string,
    { restApi, table }: AddPlayerProps,
  ) {
    super(scope, id);

    this.addPlayerFunction = new NodejsFunction(this, 'Lambda', {
      entry: getCdkHandlerPath(__dirname),
      handler: 'main',
      runtime: Runtime.NODEJS_16_X,
      architecture: Architecture.ARM_64,
      awsSdkConnectionReuse: true,
      bundling: sharedCdkEsbuildConfig,
    });

    table.grantWriteData(this.addPlayerFunction);

    restApi.root
      .resourceForPath(addPlayerContract.path)
      .addMethod(
        addPlayerContract.method,
        new LambdaIntegration(this.addPlayerFunction),
      );
  }
}
