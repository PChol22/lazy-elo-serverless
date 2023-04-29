import { Entity } from 'dynamodb-toolbox';
import { v4 as uuid } from 'uuid';

import { coreTable, PK, SK } from '../table';

export const GAME_ENTITY_NAME = 'Game';
const getGameSortKey = (): string => {
  const date = new Date().toISOString();
  const id = uuid();

  return `${date}#${id}`;
};

export const GameEntity = new Entity({
  name: GAME_ENTITY_NAME,
  attributes: {
    [PK]: { partitionKey: true, default: GAME_ENTITY_NAME },
    [SK]: { sortKey: true, default: getGameSortKey },
    playerA: { type: 'string', required: true },
    playerB: { type: 'string', required: true },
    result: { type: 'string', required: true },
  },
  table: coreTable,
} as const);
