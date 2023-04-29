import { Result } from 'contracts';
import { computeNewEloScores } from 'libs/elo';
import {
  GAME_ENTITY_NAME,
  GameEntity,
  PLAYER_ENTITY_NAME,
  PlayerEntity,
} from 'libs/table/entities';

export const main = async (): Promise<void> => {
  const lastHour = new Date();
  lastHour.setMinutes(-60, 0, 0);
  const lastHourIso = lastHour.toISOString();

  const endOfLastHour = new Date();
  endOfLastHour.setMinutes(0, 0, 0);
  const endOfLastHourIso = endOfLastHour.toISOString();

  const firstAlphabeticUuid = '00000000-0000-0000-0000-000000000000';
  const lastAlphabeticUuid = 'ffffffff-ffff-ffff-ffff-ffffffffffff';

  const { Items: allPlayers = [] } = await PlayerEntity.query(
    PLAYER_ENTITY_NAME,
  );

  let queryResult = await GameEntity.query(GAME_ENTITY_NAME, {
    between: [
      `${lastHourIso}#${firstAlphabeticUuid}`,
      `${endOfLastHourIso}#${lastAlphabeticUuid}`,
    ],
  });

  const allGames = queryResult.Items ?? [];

  while (queryResult.next) {
    queryResult = await queryResult.next();
    if (queryResult.Items !== undefined) {
      allGames.push(...queryResult.Items);
    }
  }

  const scoreByPlayerId = Object.fromEntries(
    allPlayers.map(({ id, elo }) => [id, elo]),
  );

  allGames.forEach(({ playerA, playerB, result }) => {
    const scorePlayerA = scoreByPlayerId[playerA];
    const scorePlayerB = scoreByPlayerId[playerB];

    if (scorePlayerA === undefined || scorePlayerB === undefined) {
      return;
    }

    const { newScorePlayerA, newScorePlayerB } = computeNewEloScores({
      scorePlayerA,
      scorePlayerB,
      winner: result as Result,
    });

    scoreByPlayerId[playerA] = newScorePlayerA;
    scoreByPlayerId[playerB] = newScorePlayerB;
  });

  await Promise.all(
    allPlayers.map(({ id }) =>
      PlayerEntity.update({ id, elo: scoreByPlayerId[id] }),
    ),
  );

  console.log('DONE !');
};
