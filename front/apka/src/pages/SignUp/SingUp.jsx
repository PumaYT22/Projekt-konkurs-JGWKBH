import React, { useState } from 'react'

import Navbar from '../../components/Navbar/Navbar'
import PasswordInput from '../../components/input/PasswordInput'
import {Link, useNavigate} from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { validateEmail } from '../../utils/helper'

const SingUp = () => {

    const [name,setName]=useState("")
 const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [error,setError]=useState(null)

    const navigate=useNavigate()

    const handleSingUp=async (e)=>{
        e.preventDefault();

        if(!name){
            setError("Podaj jak mam cię nazywać!")
            return
        }

        if(!validateEmail(email)){
            setError("Podaj poprawny email!")
            return
        }

        if(!password){
            setError("Proszę wprowadź hasło!")
            return
        }

        setError("")

        //RejestracAPI
        try{
            const response=await axiosInstance.post("/utworz-konto",{
                fullName:name,
                email:email,
                password:password,
            })
    
            if(response.data && response.data.error){
                setError(response.data.message)
                return
                
            }

            if(response.data && response.data.accessToken){
                localStorage.setItem("token",response.data.accessToken)
                navigate("/dashboard")
            }
        }catch(error){
            if(error.response && error.response.data && error.response.data.message){
                setError(error.response.data.message)
            } else{
                setError("Spróbuj ponownie!")
            }
        }
    }
  return (
    <>
      <Navbar></Navbar>
      <div className='flex items-center justify-center mt-28'>
        <div className='w-98 border rounded bg-white px-7 py-10'>
            <form onSubmit={handleSingUp}>
                <h4 className='text-2xl mb-7'>Rejestracja</h4>
    
                <input type="text" placeholder='Jak się mam do ciebie zwracać?' className='input-box'
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                ></input>

<input type="text" placeholder='Email' className='input-box'
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                ></input>

                <PasswordInput
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                ></PasswordInput>

                    {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

                    <button type="submit" className='btn-primary'>
                        Zarejestruj
                    </button>



                    <p className='text-sm text-center mt-4'>
                        Masz już konto? {" "}
                        <Link to="/login" className="font-medium text-primary underline">
                            Zaloguj się
                        </Link>
                    </p>
            </form>
        </div>
        </div>
    </>
  )
}

export default SingUp