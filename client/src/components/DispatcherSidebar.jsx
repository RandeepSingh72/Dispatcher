import React, {useState} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import close from '../assets/close.svg';
import open from '../assets/open.svg';

const DispatcherSidebar = () => {
    const {logout} = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
     setSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = () => {
        logout()
        navigate('/')
    }
  return (
    <div>
    <button onClick={toggleSidebar} className='bg-black p-1 left-0 rounded-r-lg'>
    <img src={open} alt="open" className='bg-black rounded-md w-[35px] h-[35px]' />
    </button>
    
   <div style={{position: 'absolute', top: '0', left: '0', zIndex: '100'}} className={`bg-gray-800 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-[0]' : 'translate-x-[-100%]'} h-full text-white min-w-[200px]`}>
    <div>
      <button
        onClick={toggleSidebar}
        className="text-white ml-36 mt-5 focus:outline-none focus:bg-gray-700"
      >
        <div>
          <img src={close} alt="close" className='bg-white rounded-md w-[35px] h-[35px]'/>
        </div>
      </button>
    </div>
    <div className={`my-2 mx-2 gap-2`}>
      <Link
        to="/dispatcher-dashboard"
        className={`block m-1 p-2 text-white rounded-md hover:bg-gray-700 ${
          location.pathname === '/dispatcher-dashboard' ? 'bg-gray-700' : ''
        }`}
      >
        Dashboard
      </Link>
      <Link
        to="/dispatcher-dashboard/create-job"
        className={`block m-1 p-2 rounded-md text-white hover:bg-gray-700 ${
          location.pathname === '/dispatcher-dashboard/create-job' ? 'bg-gray-700' : ''
        }`}
      >
       Create Job
      </Link>
      <Link
        to="/dispatcher-dashboard/completed-job"
        className={`block m-1 p-2 rounded-md text-white hover:bg-gray-700 ${
          location.pathname === '/dispatcher-dashboard/completed-job' ? 'bg-gray-700' : ''
        }`}
      >
       Completed Jobs
      </Link>
      <button className='btn mt-5' onClick={handleLogout}>Logout</button>
    </div>
  </div>
  </div>
  )
}

export default DispatcherSidebar