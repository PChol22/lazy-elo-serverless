import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';

export const addPlayerContract = new ApiGatewayContract({
  id: 'core-add-player',
  path: '/add-player',
  method: 'POST',
  integrationType: 'restApi',
  bodySchema: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      elo: { type: 'number' },
    },
    required: ['name', 'elo'],
    additionalProperties: false,
  } as const,
  outputSchemas: {
    [HttpStatusCodes.OK]: {
      type: 'object',
      properties: { id: { type: 'string' } },
      required: ['id'],
      additionalProperties: false,
    } as const,
  },
});
