// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  sensors: [
    {
      __typename: 'sensors' as const,
      id: 42,
    },
    {
      __typename: 'sensors' as const,
      id: 43,
    },
    {
      __typename: 'sensors' as const,
      id: 44,
    },
  ],
})
