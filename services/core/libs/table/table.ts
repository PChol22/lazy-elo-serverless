import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Table } from 'dynamodb-toolbox';

export const PK = 'PK';
export const SK = 'SK';
export const TABLE_NAME = 'coreTable';

const client = new DynamoDBClient({});
const DocumentClient = DynamoDBDocumentClient.from(client);

export const coreTable = new Table({
  name: TABLE_NAME,
  partitionKey: PK,
  sortKey: SK,
  DocumentClient,
});
