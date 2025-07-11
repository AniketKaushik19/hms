import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import {AdminContext} from '../../Context/AdminContext'
import {toast} from 'react-toastify'
import axios from 'axios'
const AddDoctor = () => {
  const [docdetail,setDocDetail]=useState({
      image:false,
      name:'',
      email:'',
      password:'',
      experience:'',
      fees:'',
      about:'',
      speciality:'',
      degree:'',
      address:{address1:'',address2:''}
  })
  const [loading,setLoading]=useState(false)
const onChangeHandle = (e) => {
    const { name, type, files, value } = e.target;
    
    if (type === 'file') {
        setDocDetail(prevDocDetail => ({
            ...prevDocDetail,
            [name]: files[0] // assuming single file input
        }));
      
    } else if (name === 'address1' || name === 'address2') {
        setDocDetail(prevDocDetail => ({
            ...prevDocDetail,
            address: {
                ...prevDocDetail.address,
                [name]: value
            }
        }));
    } else {
        setDocDetail(prevDocDetail => ({
            ...prevDocDetail,
            [name]: value
        }));
    }
};

      const {aToken,backendurl}=useContext(AdminContext)
  const onSubmitHandler = async(event)=>{
      event.preventDefault()
      console.log()
      setLoading(true)
      try{
        if(!docdetail.image){
          return toast.error("Image not selected")
        }
        const formData=new FormData()
        for (const key in docdetail) {
          if (key === 'address') {
            formData.append('address', JSON.stringify({line1:docdetail.address.address1,line2:docdetail.address.address2}));
          } else {
            formData.append(key, docdetail[key]);
          }
        }   
        //console log formdata 
        formData.forEach((value,key)=>{
          console.log(`${key}:${value}`)
        })

        const {data}=await axios.post(backendurl + '/api/admin/add-doctor', formData,{headers:{aToken}})

        if(data.success){
          toast.success(data.message)
            setDocDetail({
                image: false,
                name: '',
                email: '',
                password: '',
                experience: '',
                fees: '',
                about: '',
                speciality: '',
                degree: '',
                address: { address1: '', address2: '' }
            });
        
        }
        else{
          toast.error(data.message)
        }
      } catch(error){
        toast.error(error.message)
        console.log(error)
      }
      setLoading(false)

  }
  return (
    <form onSubmit={onSubmitHandler} className='m-5 w-full'>
      <p className='mb-3 text-lg font-medium'>Add Doctor</p>
      <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
        <div className='flex items-center gap-4 mb-8 text-gray-500'>
          <label htmlFor="doc-img">
            <img  className="w-16 bg-gray-100 rounded-full cursor-pointer" src={docdetail.image ? URL.createObjectURL(docdetail.image) : assets.upload_area} alt="upload image"/>
          </label>
          <input onChange={onChangeHandle} type="file" id="doc-img" name='image' hidden />
          <p>Upload doctor <br/> picture</p>
        </div>

        <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600 '>
          <div className='w-full lg:flex-1 flex flex-col gap-4'>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Name</p>
              <input onChange={onChangeHandle} value={docdetail.name} name="name" className='border rounded px-3 py-2' type="text" placeholder='Name' required />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Email</p>
              <input onChange={onChangeHandle} value={docdetail.email} name='email' className='border rounded px-3 py-2' type="email" placeholder='Email' required />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Password</p>
              <input onChange={onChangeHandle} value={docdetail.password} name='password' className='border rounded px-3 py-2' type="password" placeholder='Password' required />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Experience</p>
              <select onChange={onChangeHandle} value={docdetail.experience!=='' ? docdetail.experience:"1 Year"} name='experience' className='border rounded px-3 py-2'  id="Experience">
                <option value="1 Year">1 Year</option>
                <option value="2 Year">2 Year</option>
                <option value="3 Year">3 Year</option>
                <option value="4 Year">4 Year</option>
                <option value="5 Year">5 Year</option>
                <option value="6 Year">6 Year</option>
                <option value="7 Year">7 Year</option>
                <option value="8 Year">8 Year</option>
              </select>
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Fees</p>
              <input onChange={onChangeHandle} name='fees' value={docdetail.fees}  className='border rounded px-3 py-2' type="number" placeholder='Fees' required />
            </div>

          </div>

           <div className='w-full lg:flex-1 flex flex-col gap-4'>
          <div className='flex-1 flex flex-col gap-4'>
              <p>Speciality</p>
              <select onChange={onChangeHandle}
              name='speciality'  className='border rounded px-3 py-2'  id="Speciality" value={docdetail.speciality ? docdetail.speciality:"General physician"}>
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>

           </div>  

          <div className='flex-1 flex flex-col gap-1'>
              <p>Education</p>
              <input onChange={onChangeHandle} name='degree' value={docdetail.degree}  className='border rounded px-3 py-2' type="text" placeholder='Education' required />
          </div> 

          <div className='flex-1 flex flex-col gap-1'>
              <p>Address</p>
              <input onChange={onChangeHandle} name='address1' value={docdetail.address.address1}  className='border rounded px-3 py-2' type="text" placeholder='Address 1' required />
              <input onChange={onChangeHandle} name='address2' value={docdetail.address.address2}  className='border rounded px-3 py-2' type="text" placeholder='Address 2' required />
          </div> 

          </div>
        </div>
        
        <div className='flex-1 flex flex-col gap-1'>
              <p className='mt-4 mb-2'>About Doctor</p>
              <textarea onChange={onChangeHandle} name='about' value={docdetail.about}  className='w-full px-4 pt-2 border rounded' placeholder='write about doctor' rows={5} required />
        </div>
      <button type='submit'  className={`bg-primary text-white px-3 py-4 mt-4 rounded-full ${loading && 'bg-gray-600'}`}disabled={loading}>Add Doctor</button>
      </div>
    </form>
  )
}

export default AddDoctor