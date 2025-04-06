import { Metadata } from '@redwoodjs/web'
import { useParams } from '@redwoodjs/router'
import PatchCell from 'src/components/PatchCell/PatchCell'
import { useState } from 'react'
import GraphCell from 'src/components/Graph/GraphCell'
import GraphPatchCell from 'src/components/GraphPatchCell/GraphPatchCell'
import SoilComposition from 'src/components/SoilComposition/SoilComposition'

const PatchPage = () => {
  const { location } = useParams()
  const [activeTab, setActiveTab] = useState('Water')

  const tabs = ['Water', 'Soil', 'Soil Composition']

  return (
    <>
      <Metadata title="Patch" description="Patch page" />
      <div>{name}</div>
      <div className="max-w-4xl mx-auto">
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
          {/* <h2 className="text-xl font-bold capitalize mb-4">{activeTab}</h2> */}

          {/* Replace this with real data once your PatchCell is ready */}
          {activeTab === 'Water' && (
            <div className='justify-center space-y-20'>
              <GraphPatchCell key={activeTab} type='ntu' location={location}></GraphPatchCell>
              <GraphPatchCell key={activeTab} type='level' location={location}></GraphPatchCell>
            </div>
          )
          }
          {activeTab === 'Soil' &&
            (
              <div className='justify-center space-y-20'>
                <GraphPatchCell key={activeTab} type='s_ph' location={location}></GraphPatchCell>
                <GraphPatchCell key={activeTab} type='s_moi' location={location}></GraphPatchCell>
              </div>
            )
          }
          {activeTab === 'Soil Composition' &&
          <SoilComposition></SoilComposition>
          }
        </div>
      </div>
    </>
  )
}

export default PatchPage

