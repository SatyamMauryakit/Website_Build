import Chatview from '@/components/custom/Chatview'
import CodeView from '@/components/custom/CodeView'
import React from 'react'

const Workspace = () => {
  return (
    <div className='p-3 pr-5  mt-3'>
        <div className='grid grid-cols-1 md:grid-cols-3
        lg:grid-cols-3 gap-10'>
            <Chatview/>
            <div className='col-span-2 md:col-span-3 lg:col-span-2'>

            <CodeView/>
            </div>
        </div>
      
    </div>
  )
}

export default Workspace
