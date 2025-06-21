import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import { RelatedDoctor } from '../components/RelatedDoctor'
import { toast } from 'react-toastify'
import axios from 'axios'

export const Appointment = () => {
  const navigate=useNavigate()
  const {docId}=useParams()
  const {doctors,currencySymbol,backendUrl,token,getDoctorsData}=useContext(AppContext)
  const daysofWeek=['SUN','MON','TUE','WED','THU','FRI','SAT']
  const [docInfo,setDocInfo]=useState({
    slots_booked:{}
  })
  const [docSlot,setDocSlot]=useState([])
  const [slotIndex,setSlotIndex]=useState(0)
  const [slotTime ,setSlotTime]=useState('')
  const fetchdocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id == docId) || { slots_booked: {} };
    setDocInfo(docInfo); 
  }
  useEffect(()=>{
    if(token){
    fetchdocInfo()}
  },[docSlot])
  const getAvailableSlot = async () => {
    setDocSlot([]);
    let today = new Date();
    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
  
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0);
  
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }
  
      let timeSlot = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
  
        const slotDate = `${day}_${month}_${year}`;
        const slotTime = formattedTime;
  
        const isSlotAvailable = !(docInfo.slots_booked && docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime));
        if (isSlotAvailable) {
          timeSlot.push({
            datetime: new Date(currentDate),
            time: formattedTime
          });
        }
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      setDocSlot(prev => [...prev, timeSlot]);
    }
  };
  
  const bookAppointment =async () => {
    if(!token){
      toast.warn('Login to book appointment')
      return navigate('/login')
    }
    try{
      const date=docSlot[slotIndex][0].datetime
      let day=date.getDate()
      let month=date.getMonth()+1
      let year =date.getFullYear()
      const slotDate=day +"_"+month+"_"+year
 
      const {data}=await axios.post(backendUrl+'/api/user/book-appointment',{docId,slotDate,slotTime},{headers:{token}})

      if(data.success){
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointment')
      }
      else{
          toast.error(data.message)
      }
    }
    catch(error){
        console.log(error)
        toast.error(error.message)
    }
  }

  useEffect(()=>{fetchdocInfo()},[doctors,docId])

  useEffect(()=>{
    getAvailableSlot()
    // Scroll to the top of the page
    window.scrollTo(0,"smooth")
  },[docInfo])

  useEffect(()=>{
    
  },[docSlot])
  return docInfo &&(
    <div>
     <div className='flex flex-col sm:flex-row gap-4'>
       {/* -----Doctors details---- */}
       <div>
          <img className="bg-primary w-full sm:max-w-72 rounded-lg" src={docInfo.image} alt="doctor image" />
       </div>
       <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
         {/* ----doctor information---- */}
         <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>{docInfo.name}
           <img className="w-5" src={assets.verified_icon} alt="verification badge" /></p>
           <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
             <p>{docInfo.degree} - {docInfo.speciality}</p>
             <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
            </div>
           {/* ---Doctor About---- */}
           <div> 
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About 
              <img src={assets.info_icon} alt="info icon" />
            </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
           </div>
           <p className='text-gray-500 font-medium mt-4'>
             Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span>
           </p>
       </div>
      </div>
       {/* ---BOOKING SLOT ----- */}
       <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700 '>
         <p>Booking Slot</p>
         <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
            {docSlot.length && docSlot.map((item,index)=>(
              <div key={index} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex===index ? 'bg-primary text-white': 'border border-gray-200'}`}onClick={()=>setSlotIndex(index)}>
                  <p>{item[0]&& daysofWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0]&& item[0].datetime.getDate()}</p>
              </div>
            ))}
         </div>
         <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
            {docSlot.length && docSlot[slotIndex].map((item,index)=>(
                <p key={index} onClick={()=>setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time===slotTime ?'bg-primary text-white ':'text-gray-400 border border-e-gray-300'}`}>
                  {item.time.toLowerCase()}
                </p>
            ))}
         </div>
         <button className=' bg-primary text-white text-sm rounded-full font-light py-3 px-14 my-6 mt-5 ' onClick={bookAppointment}>Book an appointment</button>
       </div>
       {/* ---listing realted doctor---- */}
       <RelatedDoctor docId={docId} speciality={docInfo.speciality}/>
    </div>
  )
}
