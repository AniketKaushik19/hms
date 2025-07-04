import { Routes , Route } from 'react-router-dom'
import './App.css'
import { Home } from './pages/Home'
import { Doctor } from './pages/Doctor'
import { Login } from './pages/Login'
import { About } from './pages/About'
import Contact from './pages/Contact'
import { MyProfile } from './pages/MyProfile'
import { MyAppointment } from './pages/MyAppointment'
import { Appointment } from './pages/Appointment'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import 'react-toastify/ReactToastify.css'
import {ToastContainer,toast} from 'react-toastify'
function App() {
  return (
    <div className='mx-4 sm:mx-[10%'>
      <ToastContainer/>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/doctors" element={<Doctor/>}/>
        <Route path="/doctors/:speciality" element={<Doctor/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/my-profile" element={<MyProfile/>}/>
        <Route path="/my-appointment" element={<MyAppointment/>}/>
        <Route path="/appointment/:docId" element={<Appointment/>}/>

      </Routes>
      <Footer/>
    </div>
  )
}

export default App
