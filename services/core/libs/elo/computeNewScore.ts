//import { Result } from 'contracts';

type Result = 'A' | 'B';

export const computeNewEloScores = ({
  scorePlayerA,
  scorePlayerB,
  winner,
}: {
  scorePlayerA: number;
  scorePlayerB: number;
  winner: Result;
}): { newScorePlayerA: number; newScorePlayerB: number } => {
  const P1 = 1 / (1 + 10 ** ((scorePlayerB - scorePlayerA) / 400));
  const R1 = winner === 'A' ? 1 : 0;
  const P2 = 1 / (1 + 10 ** ((scorePlayerA - scorePlayerB) / 400));
  const R2 = winner === 'B' ? 1 : 0;
  const newScorePlayerB = Math.round(scorePlayerB + 32 * (R2 - P2));
  const newScorePlayerA = Math.round(scorePlayerA + 32 * (R1 - P1));

  return { newScorePlayerA, newScorePlayerB };
};
