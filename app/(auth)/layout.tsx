import { isAuthenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react'

async function Authlayout({children}:{children:ReactNode}) {
  const isUserAuthenticated = await isAuthenticated() ;
    if(isUserAuthenticated) redirect("/") ;
  return (
    <div className='auth-layout'>
      {children}
    </div>
  )
}

export default Authlayout
