import { Stack, StackProps } from 'aws-cdk-lib';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

import { AddGame, AddPlayer } from 'functions/config';
import { TABLE_NAME } from 'libs/table/table';

interface CoreProps {
  stage: string;
}

export class CoreStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps & CoreProps) {
    super(scope, id, props);

    const { stage } = props;

    const coreApi = new RestApi(this, 'Api', {
      // the stage of the API is the same as the stage of the stack
      description: `Core API - ${stage}`,
      deployOptions: {
        stageName: stage,
      },
    });

    const table = new Table(this, 'Table', {
      tableName: TABLE_NAME,
      partitionKey: {
        name: 'PK',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'SK',
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    new AddGame(this, 'AddGame', { restApi: coreApi, table });
    new AddPlayer(this, 'AddPlayer', { restApi: coreApi, table });
  }
}
