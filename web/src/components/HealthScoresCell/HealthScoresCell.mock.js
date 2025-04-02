// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  healthScores: [
    {
      __typename: 'healthScores',
      id: 42,
    },
    {
      __typename: 'healthScores',
      id: 43,
    },
    {
      __typename: 'healthScores',
      id: 44,
    },
  ],
})
