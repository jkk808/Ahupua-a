// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  sensor: {
    __typename: 'sensor' as const,
    id: 42,
  },
})
