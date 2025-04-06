export const QUERY = gql`
  query FindPatchQuery($id: Int!) {
    patch: patch(id: $id) {
      id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ patch }) => {
  return <div>{JSON.stringify(patch)}</div>
}
