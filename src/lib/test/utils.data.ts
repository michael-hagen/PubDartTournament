export const eliminationCases: Array<[number, Array<{ round: number; matchCount: number }>]> = [
  [
    4,
    [
      { round: 1, matchCount: 2 },
      { round: 2, matchCount: 1 },
    ],
  ],
  [
    8,
    [
      { round: 1, matchCount: 4 },
      { round: 2, matchCount: 2 },
      { round: 3, matchCount: 1 },
    ],
  ],
  [
    16,
    [
      { round: 1, matchCount: 8 },
      { round: 2, matchCount: 4 },
      { round: 3, matchCount: 2 },
      { round: 4, matchCount: 1 },
    ],
  ],
  [
    32,
    [
      { round: 1, matchCount: 16 },
      { round: 2, matchCount: 8 },
      { round: 3, matchCount: 4 },
      { round: 4, matchCount: 2 },
      { round: 5, matchCount: 1 },
    ],
  ],
  [
    64,
    [
      { round: 1, matchCount: 32 },
      { round: 2, matchCount: 16 },
      { round: 3, matchCount: 8 },
      { round: 4, matchCount: 4 },
      { round: 5, matchCount: 2 },
      { round: 6, matchCount: 1 },
    ],
  ],
  [
    128,
    [
      { round: 1, matchCount: 64 },
      { round: 2, matchCount: 32 },
      { round: 3, matchCount: 16 },
      { round: 4, matchCount: 8 },
      { round: 5, matchCount: 4 },
      { round: 6, matchCount: 2 },
      { round: 7, matchCount: 1 },
    ],
  ],
]

export const doubleEliminationCases: Array<
  [number, Array<{ round: number; winnerMatchCount: number; loserMatchCount: number }>]
> = [
  [
    4,
    [
      { round: 1, winnerMatchCount: 2, loserMatchCount: 0 },
      { round: 2, winnerMatchCount: 1, loserMatchCount: 1 },
      { round: 3, winnerMatchCount: 0, loserMatchCount: 1 },
      { round: 4, winnerMatchCount: 1, loserMatchCount: 0 },
    ],
  ],
  [
    8,
    [
      { round: 1, winnerMatchCount: 4, loserMatchCount: 0 },
      { round: 2, winnerMatchCount: 2, loserMatchCount: 2 },
      { round: 3, winnerMatchCount: 0, loserMatchCount: 2 },
      { round: 4, winnerMatchCount: 1, loserMatchCount: 1 },
      { round: 5, winnerMatchCount: 0, loserMatchCount: 1 },
      { round: 6, winnerMatchCount: 1, loserMatchCount: 0 },
    ],
  ],
  [
    16,
    [
      { round: 1, winnerMatchCount: 8, loserMatchCount: 0 },
      { round: 2, winnerMatchCount: 4, loserMatchCount: 4 },
      { round: 3, winnerMatchCount: 0, loserMatchCount: 4 },
      { round: 4, winnerMatchCount: 2, loserMatchCount: 2 },
      { round: 5, winnerMatchCount: 0, loserMatchCount: 2 },
      { round: 6, winnerMatchCount: 1, loserMatchCount: 1 },
      { round: 7, winnerMatchCount: 0, loserMatchCount: 1 },
      { round: 8, winnerMatchCount: 1, loserMatchCount: 0 },
    ],
  ],
  [
    32,
    [
      { round: 1, winnerMatchCount: 16, loserMatchCount: 0 },
      { round: 2, winnerMatchCount: 8, loserMatchCount: 8 },
      { round: 3, winnerMatchCount: 0, loserMatchCount: 8 },
      { round: 4, winnerMatchCount: 4, loserMatchCount: 4 },
      { round: 5, winnerMatchCount: 0, loserMatchCount: 4 },
      { round: 6, winnerMatchCount: 2, loserMatchCount: 2 },
      { round: 7, winnerMatchCount: 0, loserMatchCount: 2 },
      { round: 8, winnerMatchCount: 1, loserMatchCount: 1 },
      { round: 9, winnerMatchCount: 0, loserMatchCount: 1 },
      { round: 10, winnerMatchCount: 1, loserMatchCount: 0 },
    ],
  ],
  [
    64,
    [
      { round: 1, winnerMatchCount: 32, loserMatchCount: 0 },
      { round: 2, winnerMatchCount: 16, loserMatchCount: 16 },
      { round: 3, winnerMatchCount: 0, loserMatchCount: 16 },
      { round: 4, winnerMatchCount: 8, loserMatchCount: 8 },
      { round: 5, winnerMatchCount: 0, loserMatchCount: 8 },
      { round: 6, winnerMatchCount: 4, loserMatchCount: 4 },
      { round: 7, winnerMatchCount: 0, loserMatchCount: 4 },
      { round: 8, winnerMatchCount: 2, loserMatchCount: 2 },
      { round: 9, winnerMatchCount: 0, loserMatchCount: 2 },
      { round: 10, winnerMatchCount: 1, loserMatchCount: 1 },
      { round: 11, winnerMatchCount: 0, loserMatchCount: 1 },
      { round: 12, winnerMatchCount: 1, loserMatchCount: 0 },
    ],
  ],
  [
    128,
    [
      { round: 1, winnerMatchCount: 64, loserMatchCount: 0 },
      { round: 2, winnerMatchCount: 32, loserMatchCount: 32 },
      { round: 3, winnerMatchCount: 0, loserMatchCount: 32 },
      { round: 4, winnerMatchCount: 16, loserMatchCount: 16 },
      { round: 5, winnerMatchCount: 0, loserMatchCount: 16 },
      { round: 6, winnerMatchCount: 8, loserMatchCount: 8 },
      { round: 7, winnerMatchCount: 0, loserMatchCount: 8 },
      { round: 8, winnerMatchCount: 4, loserMatchCount: 4 },
      { round: 9, winnerMatchCount: 0, loserMatchCount: 4 },
      { round: 10, winnerMatchCount: 2, loserMatchCount: 2 },
      { round: 11, winnerMatchCount: 0, loserMatchCount: 2 },
      { round: 12, winnerMatchCount: 1, loserMatchCount: 1 },
      { round: 13, winnerMatchCount: 0, loserMatchCount: 1 },
      { round: 14, winnerMatchCount: 1, loserMatchCount: 0 },
    ],
  ],
]
