import React, { useContext, useState } from 'react'
import { AdminContext } from '../Context/AdminContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../Context/DoctorContext.jsx'
const Login = () => {
    const [state,setState]=useState("Admin")
    const [email, setEmail]=useState('')
    const [password, setPassword]=useState('')

    const {setAToken,backendurl}=useContext(AdminContext)
    const {dToken,setDToken}=useContext(DoctorContext)
    
    const onSubmitHandler=async (event) => {
        event.preventDefault()
        try{
            if(state==='Admin'){
                const {data}=await axios.post(backendurl+'/api/admin/login',{email,password})
                if(data.success){
                  localStorage.setItem('aToken',data.token)
                  setAToken(data.token)
                }
                else{
                  toast.error(data.message)
                }
            }else{
              const {data}=await axios.post(backendurl+'/api/doctor/login',{email,password})
              if(data.success){
                localStorage.setItem('dToken',data.token)
                setDToken(data.token)
                console.log(data.token)
              }
              else{
                toast.error(data.message)
              }
            }
        }catch(error){
          toast.error(error.message)
        }
    }
  return (
    <form className='min-h-[80vh] flex items-center'>
       <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
          <p className='text-2xl m-auto'><span className='text-primary'>{state}</span>Login</p>
          <div className='w-full'>
            <p>Email</p>
            <input  className="border border-[#DADADA] rounded w-full p-2 mt-1" type="email" required  onChange={(e)=>setEmail(e.target.value)} value={email}/> 
          </div> 
          <div className='w-full'>
            <p>Password</p>
            <input className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required onChange={(e)=>setPassword(e.target.value)} value={password} />
          </div>
          <button className='bg-primary  text-white p-2 mx-3 w-full text-base font-semibold rounded-md' onClick={onSubmitHandler}>Login</button>
          {
            state==='Admin'?<p>Doctor login? <span className='text-primary underline cursor-pointer' onClick={()=>setState('Doctor')}>Click here</span></p>
            : <p>Admin login?<span className='text-primary underline cursor-pointer' onClick={()=>setState('Admin')}>Click here</span></p>
          }
       </div>
    </form>
  )
}

export default Login        