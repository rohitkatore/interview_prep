import React, { ReactNode } from 'react'

function Authlayout({children}:{children:ReactNode}) {
  return (
    <div className='auth-layout'>
      {children}
    </div>
  )
}

export default Authlayout
