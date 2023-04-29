import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';

export const Result = {
  A: 'A',
  B: 'B',
} as const;

export type Result = (typeof Result)[keyof typeof Result];

export const addGameContract = new ApiGatewayContract({
  id: 'core-add-game',
  path: '/add-game',
  method: 'POST',
  integrationType: 'restApi',
  bodySchema: {
    type: 'object',
    properties: {
      playerA: { type: 'string' },
      playerB: { type: 'string' },
      result: { enum: Object.values(Result) },
    },
    required: ['playerA', 'playerB', 'result'],
    additionalProperties: false,
  } as const,
  outputSchemas: {
    [HttpStatusCodes.OK]: {
      type: 'object',
      properties: { message: { type: 'string' } },
      required: ['message'],
      additionalProperties: false,
    } as const,
  },
});
