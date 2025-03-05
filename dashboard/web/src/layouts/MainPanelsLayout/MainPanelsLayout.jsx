import { Link, routes } from '@redwoodjs/router'
import SidePanel from 'src/components/Panels/SidePanel/SidePanel'
import TopPanel from 'src/components/Panels/TopPanel/TopPanel'
import React from 'react';

const MainPanelLayout = ({ children }) => {
  return (
    <>
      <div className="flex flex-col w-full h-screen bg-gray-50">
      <TopPanel />        

        <main>          
          <SidePanel />
        </main>

      </div>
    </>
  )
}

export default MainPanelLayout
