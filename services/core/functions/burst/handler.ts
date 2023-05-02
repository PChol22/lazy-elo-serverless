import {
  getFetchRequest,
  getHandler,
  HttpStatusCodes,
} from '@swarmion/serverless-contracts';
import fetch from 'node-fetch';

import { addGameContract, burstContract, Result } from 'contracts';
import { ajv } from 'libs/ajv';

const playerIds = [
  '031db185-6391-4fd1-9d58-604d968bbb66',
  '0e0482f7-ef08-4020-aff4-d8c2bd3e1e6c',
  '20afc4da-7cab-4c02-a222-2b5c222e5e82',
  '304c3db0-4f92-409b-933c-60df3ffcc469',
  '3cc39d84-72e5-4074-87b2-180b07ff697b',
  '5a495bab-d0a0-416d-b6f9-792d24028e68',
  '9a6233e7-50d2-40df-877e-61a0747171e5',
  'bb3596ca-88ec-46e9-bb4d-462999eeb251',
  'cc2af8bf-5675-46b2-9d5d-1189858876d5',
  'd264b9bb-13cc-4082-a831-c4b90be21536',
];

const results = Object.values(Result);

const pickTwoPlayers = () => {
  const playerA = playerIds[Math.floor(Math.random() * playerIds.length)] ?? '';
  let playerB = playerIds[Math.floor(Math.random() * playerIds.length)] ?? '';
  while (playerA === playerB) {
    playerB = playerIds[Math.floor(Math.random() * playerIds.length)] ?? '';
  }

  return { playerA, playerB };
};

const pickResult = () => {
  return results[Math.floor(Math.random() * results.length)] ?? 'A';
};

export const main = getHandler(burstContract, { ajv })(async () => {
  const requests = new Array(10).fill(0).map(async () => {
    const { playerA, playerB } = pickTwoPlayers();
    const result = pickResult();
    // @ts-ignore this is bad
    const { statusCode } = await getFetchRequest(addGameContract, fetch, {
      baseUrl: process.env.BASE_URL ?? '',
      body: {
        playerA,
        playerB,
        result,
      },
    });

    return { statusCode };
  });

  const result = await Promise.all(requests);

  if (result.some(({ statusCode }) => statusCode !== HttpStatusCodes.OK)) {
    return {
      statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      body: { message: 'Failed' },
    };
  }

  return { statusCode: HttpStatusCodes.OK, body: { message: 'Created' } };
});
