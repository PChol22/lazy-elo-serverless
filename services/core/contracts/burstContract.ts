import {
  ApiGatewayContract,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';

export const burstContract = new ApiGatewayContract({
  id: 'core-burst',
  path: '/burst',
  method: 'POST',
  integrationType: 'restApi',
  outputSchemas: {
    [HttpStatusCodes.OK]: {
      type: 'object',
      properties: { message: { type: 'string' } },
      required: ['message'],
      additionalProperties: false,
    } as const,
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: {
      type: 'object',
      properties: { message: { type: 'string' } },
      required: ['message'],
      additionalProperties: false,
    } as const,
  },
});
