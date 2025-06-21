import React, { useContext } from 'react'
import './App.css'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import { AdminContext } from './Context/AdminContext';
 import 'react-toastify/ReactToastify.css'
import Navbar from './Components/Navbar';
import {Routes ,Route} from 'react-router-dom'
import Dashboard from './pages/AdminsPage/Dashboard';
import AllAppointment from './pages/AdminsPage/AllAppointment';
import AddDoctor from './pages/AdminsPage/AddDoctor';
import DoctorsList from './pages/AdminsPage/DoctorsList';
import Sidebar from './Components/Sidebar';
import { DoctorContext } from './Context/DoctorContext';
import DoctorDashboard from './pages/DoctorsPage/DoctorDashboard'
import DoctorAppointment from './pages/DoctorsPage/DoctorAppointment';
import DoctorProfile from './pages/DoctorsPage/DoctorProfile';

function App(){
  const {aToken}=useContext(AdminContext)
  const {dToken}=useContext(DoctorContext)
  return aToken || dToken ? (
    <div className='bg-[#F8F9FD]'>
       <ToastContainer/>
        <Navbar/>
        <div className='flex'>
          <Sidebar/>
          <Routes>
            {/* //admin routes  */}
              <Route path='/' element={<></>}/>
              <Route path='/admin-dashboard' element={<Dashboard/>}/>
              <Route path='/all-appointment' element={<AllAppointment/>}/>
              <Route path='/add-doctor' element={<AddDoctor/>}/>
              <Route path='/doctor-list' element={<DoctorsList/>}/>

              {/* //doctor routes  */}
              <Route path='/doctor-dashboard' element={<DoctorDashboard/>}/>
              <Route path='/doctor-profile' element={<DoctorProfile/>}/>
              <Route path='/doctor-appointments' element={<DoctorAppointment/>}/>
              
          </Routes>
        </div>
    </div>
  ):
  (
    <>
        <Login/>
        <ToastContainer/>
    </>
  )
}

export default App