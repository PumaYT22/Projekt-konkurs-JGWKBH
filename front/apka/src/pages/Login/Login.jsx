import React from 'react'
import Navbar from '../../components/Navbar/Navbar'

const Login = () => {
  return (
    <>
      <Navbar></Navbar>
      <div>
        <div>
            <form onSubmit={()=>{}}>
                <h4 className='text'>Login</h4>
            </form>
        </div>
      </div>
    </>
 
  )
}

export default Login