import { getCdkHandlerPath } from '@swarmion/serverless-helpers';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

import { sharedCdkEsbuildConfig } from '@elo/serverless-configuration';

import { addGameContract } from 'contracts';

type AddGameProps = { restApi: RestApi; table: Table };

export class AddGame extends Construct {
  public addGameFunction: NodejsFunction;

  constructor(scope: Construct, id: string, { restApi, table }: AddGameProps) {
    super(scope, id);

    this.addGameFunction = new NodejsFunction(this, 'Lambda', {
      entry: getCdkHandlerPath(__dirname),
      handler: 'main',
      runtime: Runtime.NODEJS_16_X,
      architecture: Architecture.ARM_64,
      awsSdkConnectionReuse: true,
      bundling: sharedCdkEsbuildConfig,
    });

    table.grantWriteData(this.addGameFunction);

    restApi.root
      .resourceForPath(addGameContract.path)
      .addMethod(
        addGameContract.method,
        new LambdaIntegration(this.addGameFunction),
      );
  }
}
