// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  examplePosts: [
    {
      __typename: 'examplePosts',
      id: 42,
    },
    {
      __typename: 'examplePosts',
      id: 43,
    },
    {
      __typename: 'examplePosts',
      id: 44,
    },
  ],
})
