import { Link, routes } from '@redwoodjs/router'
import SidePanel from 'src/components/Panels/SidePanel/SidePanel'
import TopPanel from 'src/components/Panels/TopPanel/TopPanel'
import React from 'react';



const MainPanelLayout = ({ children }) => {
  return (
    <>      
      <div className='flex h-screen'>
          <SidePanel />   
        <div className='flex-1 flex flex-col'>
          <TopPanel />        
          <main className='flex-1 ml-64 overflow-auto p-6'>                           
            {children}
          </main>      
        </div>
      </div>
    </>
  )
}

export default MainPanelLayout
