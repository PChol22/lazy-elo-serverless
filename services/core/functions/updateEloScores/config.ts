import { getCdkHandlerPath } from '@swarmion/serverless-helpers';
import { Duration } from 'aws-cdk-lib';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Rule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

import { sharedCdkEsbuildConfig } from '@elo/serverless-configuration';

type UpdateEloScoresProps = { table: Table; rule: Rule };

export class UpdateEloScores extends Construct {
  public updateEloScoresFunction: NodejsFunction;

  constructor(
    scope: Construct,
    id: string,
    { table, rule }: UpdateEloScoresProps,
  ) {
    super(scope, id);

    this.updateEloScoresFunction = new NodejsFunction(this, 'Lambda', {
      entry: getCdkHandlerPath(__dirname),
      handler: 'main',
      runtime: Runtime.NODEJS_16_X,
      architecture: Architecture.ARM_64,
      awsSdkConnectionReuse: true,
      bundling: sharedCdkEsbuildConfig,
      timeout: Duration.seconds(30),
      memorySize: 1024,
    });

    table.grantWriteData(this.updateEloScoresFunction);
    table.grantReadData(this.updateEloScoresFunction);

    rule.addTarget(new LambdaFunction(this.updateEloScoresFunction));
  }
}
