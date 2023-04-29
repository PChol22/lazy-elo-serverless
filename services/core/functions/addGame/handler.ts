import { getHandler, HttpStatusCodes } from '@swarmion/serverless-contracts';

import { addGameContract } from 'contracts';
import { ajv } from 'libs/ajv';
import { GameEntity } from 'libs/table/entities';

export const main = getHandler(addGameContract, { ajv })(
  async ({ body: { playerA, playerB, result } }) => {
    await GameEntity.put({
      playerA,
      playerB,
      result,
    });

    return { statusCode: HttpStatusCodes.OK, body: { message: 'Created' } };
  },
);
