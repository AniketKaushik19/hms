import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../Context/DoctorContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../Context/AppContext'

const DoctorDashboard = () => {
  const {dToken,dashData,setDashData,getDashData,completeAppointment ,cancelAppointment}=useContext(DoctorContext)
  const {currency,slotDateFormat}=useContext(AppContext)
  useEffect(()=>{
    if(dToken){
      getDashData()
      console.log(dashData)
    }
  },[dToken])
  return dashData &&(
    <div className="m-5">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-gray-100 cursor-pointer hover:scale-105 transition-all">
              <img className="w-14 " src={assets.doctor_icon} alt="doctor icon" />
              <div>
                <p className="text-xl font-semibold text-gray-600">
                 {currency}{dashData.earnings}
                </p>
                <p className="text-gray-400">Earnings</p>
              </div>
            </div>
    
            <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-gray-100 cursor-pointer hover:scale-105 transition-all">
              <img
                className="w-14 "
                src={assets.appointments_icon}
                alt="Appointments icon"
              />
              <div>
                <p className="text-xl font-semibold text-gray-600">
                  {dashData.appointments}
                </p>
                <p className="text-gray-400">Appointments</p>
              </div>
            </div>
    
            <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-gray-100 cursor-pointer hover:scale-105 transition-all">
              <img
                className="w-14 "
                src={assets.patients_icon}
                alt="Patients icon"
              />
              <div>
                <p className="text-xl font-semibold text-gray-600">
                  {dashData.patients}
                </p>
                <p className="text-gray-400">Patients</p>
              </div>
            </div>
          </div>
    
          <div className="bg-white">
            <div className="flex item-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
              <img src={assets.list_icon} alt="list icon" />
              <p className="font-semibold">Latest Bookings</p>
            </div>
          </div>
    
          <div className="pt-4 border border-t-0 ">
            {dashData.latestAppointments && dashData.latestAppointments.map((item, index) => (
              <div key={index} className="flex items-center gap-3 px-6 py-3 hover:bg-gray-100">
                <img className="rounded-full w-10" src={item.userData.image} alt="doctor image" />
                <div className="flex-1 text-sm">
                  <p className="text-gray-800 font-medium">{item.userData.name}</p>
                  <p className="text-gray-600">{slotDateFormat(item.slotDate)} {item.slotTime}</p>
                </div>
                   {
                     item.cancelled?
                      <p className='text-red-400
                      text-xs font-medium'>Cancelled</p>
                      :item.isComplete?
                       <p className='text-green-500 text-xs font-medium'>Completed</p>
                       :
                       <div className='flex'>
                          <img className='w-10 cursor-pointer' onClick={()=>cancelAppointment(item._id)} src={assets.cancel_icon} alt="cancel icon" />
                          <img onClick={()=>completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="tick icon" />
                       </div>
                   }
               </div>
            ))}
          </div>
        </div>
  )
}

export default DoctorDashboard