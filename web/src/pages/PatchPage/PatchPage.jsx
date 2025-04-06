// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { useParams } from '@redwoodjs/router'
import PatchCell from 'src/components/PatchCell/PatchCell'

const PatchPage = () => {
  const id = useParams()
  return (
    <>
      <Metadata title="Patch" description="Patch page" />

      <div className="ml-72 p-6">
      {/* <PatchCell></PatchCell> */}
      {/* <h1 className="text-2xl font-bold mb-4">Viewing: {id}</h1> */}
      {/* Fetch data based on patch ID or just display static for now */}
      {/* <p>This is content for <strong>{id}</strong>. You can fetch sensor data or details here.</p> */}
      </div>
    </>
  )
}

export default PatchPage
