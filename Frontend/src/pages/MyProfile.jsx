import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
// import {assets} from '../assets/assets'
import {toast} from 'react-toastify'
import axios from 'axios'
export const MyProfile = () => {
  const {userData,setUserData,backendUrl,userProfile,token}=useContext(AppContext)
  const [isEdit,setIsEdit]=useState(false)
  const [image,setImage]=useState(null)

  const updateUserProfile=async () => {
    try{
      const formData=new FormData()
      for (const key in userData) {
        if (key === 'address') {
          formData.append('address', JSON.stringify({line1:userData.address.line1,line2:userData.address.line2}));
        } else {
          formData.append(key, userData[key]);
        }
      }   
      formData.forEach((value,key)=>{
        console.log(`${key}:${value}`)
      })

      image && formData.append('image',image)
      console.log(userData)
      const {data}=await axios.post(backendUrl+'/api/user/update-profile',formData,{headers:{token}})
      if(data.success){
        toast.success(data.message)
        await userProfile()
        setIsEdit(false)
        setImage(false)
      }else{
        toast.error(data.message)
      }
    }
    catch(error){
      toast.error(error.message)
      console.log(error)
    }
  }

  const onChangeHandle = (e) => {
    const { name, type, files, value } = e.target;
    if (type === 'file') {
      const file = files[0];
      setImage(file); // assuming single file input      
    } else if (name === 'line1' || name === 'line2') {
        setUserData(prevUserData => ({
            ...prevUserData,
            address: {
                ...prevUserData.address,
                [name]: value
            }
        }));
    } else {
        setUserData(prevUserData => ({
            ...prevUserData,
            [name]: value
        }));
    }
   };
  return userData && (
    <div className='max-w-lg flex flex-col gap-2 text-sm mx-auto'>
        {isEdit?
          <>
          <label htmlFor='userimage'>
                <img  className="w-36 bg-gray-100  rounded-full cursor-pointer" src={image ? URL.createObjectURL(image):userData.image } alt="upload image"/>
          </label>
             <input name="image" onChange={onChangeHandle} type="file" id='userimage' hidden/>
          </>
          :
          <img  className='w-36  mt-4 rounded mr-3' src={userData.image} alt="user image" />
        }
        {
          isEdit ? <input name='name' className='bg-gray-50 text-3xl font-medium max-w-60 mt-4' type="text" onChange={onChangeHandle} value={userData.name}/>
          : <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData.name}</p>
        }
        <hr className='bg-zinc-400 h-[1px]'/>
        <div>
           <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
           <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
              <p className='font-medium'>Email id:</p>
              <p className='text-blue-500'>{userData.email}</p>
              <p className='font-medium'>Phone :</p>
               {
                isEdit ? <input name='email' className='bg-gray-100 max-w-52' type="text" onChange={onChangeHandle} value={userData.phone}/>
                : <p className='text-blue-400'>{userData.phone}</p>
               }
              <p className='font-medium'>Address :</p>
               {
                isEdit ? <p>
                   <input name="line1" className='bg-gray-50 ' type="text" onChange={onChangeHandle} value={userData.address.line1}/> <br />
                  <input name='line2' className='bg-gray-50' type="text" onChange={onChangeHandle} value={userData.address.line2}/>
                </p> 
                :
                 <p className='text-gray-500'>      {userData.address.line1}
                     <br/>
                {userData.address.line2}
                </p>
                 
               }

           </div>
        </div>
        <div>
          <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
          <hr className='bg-zinc-400 h-[1px] border-none '/>
          <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
            <p className='font-medium'>Gender:</p>
            {
             isEdit ? 
             <select  className='max-w-20 bg-gray-100' name="Gender" onChange={onChangeHandle}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
             </select>
          : <p className='text-gray-400'>{userData.gender}</p>
        }
        <p className='font-medium'>Birthday:</p>
        {isEdit?
          <input className='max-w-28 bg-gray-100' type="date" name='dob' onChange={onChangeHandle} value={userData.dob}/>
          :
          <p className='text-gray-400'>{userData.dob}</p>
        }
          </div>
        </div>
        <div className='mt-10 '>
          {isEdit?
          <button  className='border border-primary px-8 py-2 rounded-full transition-all duration-500 hover:bg-primary hover:text-white' onClick={updateUserProfile}>Save information</button>  
          : <button className='border border-primary px-8 py-2 rounded-full transition-all duration-500 hover:bg-primary hover:text-white' onClick={()=>setIsEdit(true)}>Edit</button>      
        }
        </div>
    </div>
  )
}
