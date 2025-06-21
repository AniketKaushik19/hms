import React, { useContext } from 'react'
import { AdminContext } from '../Context/AdminContext'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { DoctorContext } from '../Context/DoctorContext'

const Sidebar = () => {
    const {aToken}=useContext(AdminContext)
    const {dToken}=useContext(DoctorContext)

  return (
    <div className='min-h-screen bg-white border-r'>
       {
        aToken && <ul className='text-[#515151] mt-5'>
            <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-[25vh] cursor-pointer ${isActive ?'bg-[#F2F3FF] border-r-4  border-primary':''}`} to={'/admin-dashboard'}>
                <img src={assets.home_icon} alt="home icon" />
                Dashboard
            </NavLink>
            <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 p-2 md:px-9 md:min-w-[25vh] cursor-pointer ${isActive ?'bg-[#F2F3FF] border-r-4  border-primary':''}`} to={'/all-appointment'}>
                <img src={assets.appointment_icon} alt="appointment icon" />
                Appointments
            </NavLink>
            <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-[25vh] cursor-pointer ${isActive ?'bg-[#F2F3FF] border-r-4  border-primary':''}`} to={'/add-doctor'}>
                <img src={assets.add_icon} alt="add icon" />
                Add Doctors
            </NavLink>
            <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-[25vh] cursor-pointer ${isActive ?'bg-[#F2F3FF] border-r-4  border-primary':''}`} to={'/doctor-list'}>
                <img src={assets.people_icon} alt="people icon" />
                Doctors List
            </NavLink> 
        </ul>
       }

       {
        dToken && <ul className='text-[#515151] mt-5'>
            <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-[25vh] cursor-pointer ${isActive ?'bg-[#F2F3FF] border-r-4  border-primary':''}`} to={'/doctor-dashboard'}>
                <img src={assets.home_icon} alt="home icon" />
                Dashboard
            </NavLink>
            <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-[25vh] cursor-pointer ${isActive ?'bg-[#F2F3FF] border-r-4  border-primary':''}`} to={'/doctor-appointments'}>
                <img src={assets.appointment_icon} alt="appointment icon" />
                Appointments
            </NavLink>
            <NavLink className={({isActive})=>`flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-[25vh] cursor-pointer ${isActive ?'bg-[#F2F3FF] border-r-4  border-primary':''}`} to={'/doctor-profile'}>
                <img src={assets.people_icon} alt="people icon" />
                Doctors Profile
            </NavLink> 
        </ul>
       }
    </div>
  )
}

export default Sidebar