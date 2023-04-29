import { getHandler, HttpStatusCodes } from '@swarmion/serverless-contracts';
import { v4 as uuid } from 'uuid';

import { addPlayerContract } from 'contracts';
import { ajv } from 'libs/ajv';
import { PlayerEntity } from 'libs/table/entities';

export const main = getHandler(addPlayerContract, { ajv })(
  async ({ body: { name, elo } }) => {
    const id = uuid();
    await PlayerEntity.put({
      name,
      elo,
      id,
    });

    return { statusCode: HttpStatusCodes.OK, body: { id } };
  },
);
