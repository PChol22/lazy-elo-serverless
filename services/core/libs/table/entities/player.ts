import { Entity } from 'dynamodb-toolbox';

import { coreTable, PK, SK } from '../table';

export const PLAYER_ENTITY_NAME = 'Player';
export const getPlayerSortKey = ({ id }: { id: string }): string => id;

export const PlayerEntity = new Entity({
  name: PLAYER_ENTITY_NAME,
  attributes: {
    [PK]: { partitionKey: true, default: PLAYER_ENTITY_NAME },
    [SK]: { sortKey: true, default: getPlayerSortKey },
    id: { type: 'string', required: true },
    name: { type: 'string', required: true },
    elo: { type: 'number', required: true },
  },
  table: coreTable,
} as const);
