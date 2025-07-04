import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {AppContext} from "../context/AppContext"


export const Doctor = () => {
  const navigate=useNavigate();
  const {speciality}=useParams()
  const [filterdoc,setFilterdoc]=useState([])
  const [showFilter, setShowFilter]=useState(false)
  const {doctors}=useContext(AppContext)
  const applyFilter=()=>{
    if(speciality){
      setFilterdoc(doctors.filter(doc=>doc.speciality===speciality))
    }
    else{
      setFilterdoc(doctors)
    }
  }
  useEffect(()=>{
    applyFilter()
  },[doctors,speciality])
  return (
    <div>
      <p className='text-gray-600 '>Browse through the doctors specialist.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5 '>
        <button className={`py-1 px-3 border  rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white':'' }`}onClick={()=>setShowFilter(prev =>!prev)}>Filter</button>

        <div className={`flex flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex':"hidden sm:flex"}`}>
          <p onClick={()=>speciality==="General physician"? navigate("/doctors"): navigate("/doctors/General physician")}className={`w=[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality==="General physician"?"bg-indigo-100  text-black ":""} `}>General physician</p>
          <p onClick={()=>speciality==="Gynecologist"? navigate("/doctors"): navigate("/doctors/Gynecologist")}className={`w=[94vw] ${speciality==="Gynecologist"?"bg-indigo-100 text-black ":""} sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer`}>Gynecologist</p>
          <p onClick={()=>speciality==="Dermatologist"? navigate("/doctors"): navigate("/doctors/Dermatologist")}className={`w=[94vw] ${speciality==="Dermatologist"?"bg-indigo-100 text-black ":""} sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer`}>Dermatologist</p>
          <p onClick={()=>speciality==="Pediatricians"? navigate("/doctors"): navigate("/doctors/Pediatricians")}className={`w=[94vw] ${speciality==="Pediatricians"?"bg-indigo-100 text-black ":""} sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer`}>Pediatricians</p>
          <p onClick={()=>speciality==="Neurologist"? navigate("/doctors"): navigate("/doctors/Neurologist")}className={`w=[94vw] ${speciality==="Neurologist"?"bg-indigo-100 text-black ":""} sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer`}>Neurologist</p>
          <p onClick={()=>speciality==="Gastroenterologist"? navigate("/doctors"): navigate("/doctors/Gastroenterologist")}className={`w=[94vw] ${speciality==="Gastroenterologist"?"bg-indigo-100 text-black ":""} sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer`}>Gastroenterologist</p>
        </div>
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
           {filterdoc.map((item, index)=>(
                <div key={index} onClick={()=>navigate(`/appointment/${item._id}`)} className='border  border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'>
                    <img className="bg-blue-200" src={item.image} alt="doctor image" />
                    <div className='p-4'>
                    <div className={`flex items-center gap-2 text-sm text-center ${item.available? "text-green-500":"text-red-600"}`}>
                      <p className={`w-2 h-2 ${item.available?"bg-green-500":"bg-red-500"} rounded-full`}  ></p>
                      <p>{item.available? "Available": "Unavailable"}</p>
                      </div>
                    </div>
                    <p className='text-gray-900 text-lg mx-2 font-medium'>{item.name}</p>
                    <p className='text-gray-600 text-sm mx-2'>{item.speciality}</p>  
                </div>
            ))}
        </div>
      </div>
    </div>
  )
}
