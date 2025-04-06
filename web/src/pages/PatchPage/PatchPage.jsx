import { Metadata } from '@redwoodjs/web'
import { useParams } from '@redwoodjs/router'
import PatchCell from 'src/components/PatchCell/PatchCell'
import { useState } from 'react'

const PatchPage = () => {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('water')

  const tabs = ['Overall Health', 'Water', 'Soil', 'Soil Composition']

  return (
    <>
      <Metadata title="Patch" description="Patch page" />
      <div className="p-6 max-w-4xl mx-auto">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold capitalize ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-blue-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold capitalize mb-4">{activeTab}</h2>

          {/* Replace this with real data once your PatchCell is ready */}
          {activeTab === 'water' && <p>Water data will go here.</p>}
          {activeTab === 'soil' && <p>Soil data will go here.</p>}
          {activeTab === 'soil composition' && <p>Soil composition details will go here.</p>}
        </div>

        {/* Optional: pass ID into PatchCell for fetching real data */}
        {/* <PatchCell id={parseInt(id)} /> */}
      </div>
    </>
  )
}

export default PatchPage

