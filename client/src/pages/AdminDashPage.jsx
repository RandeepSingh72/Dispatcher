import React, {useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import profile from '../assets/profile.svg';

const AdminDashPage = () => {
  const [users, setUsers] = useState([])
  const navigate = useNavigate()
  const {pathname} = useLocation()
  const {user, setUser } = useAuth();

  const fetchAllUsers = async() => {
    try {
      const response = await fetch('https://dispatcher-container.onrender.com/api/allUsers', {
        method: 'GET',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const allUsers = await response.json();
      setUsers(allUsers.users)
    } catch (error) {
      console.log(error);
    }
  }
 


  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Token not found');
      }

      const response = await fetch('https://dispatcher-container.onrender.com/api/user', {
        method: 'GET',
        mode: 'no-cors',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
         const userData = await response.json();
         setUser(userData);
         
        // Check if user is logged in and userType is available
        if (userData.userType) {
          const dashboardRoute = `/${userData.userType.toLowerCase()}-dashboard`;
          // Check if the current route is not already the dashboard route
          if (window.location.pathname !== dashboardRoute) {
            navigate(dashboardRoute);
          }
        }
      } else {
        throw new Error('Failed to fetch user');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
  fetchAllUsers()
  if (user === undefined) {
    fetchUser();
  }
  }, []);

  console.log(user);
  return (
    <div>
      <div className='flex justify-between items-center'>
      <Sidebar/>
      <div className='flex flex-row gap-1 mr-3'>
        <div>
        <img src={profile} alt="profile" className='w-[35px] h-[35px]' />
        </div>
        <div className='text-black mt-1 capitalize font-bold'>
          {user.username}
        </div>
      </div>
      </div>
          {pathname !== '/admin-dashboard' ? <Outlet/> : (
            <div className='m-5'>
              {users && users.map((user)=>(
                <div key={user.username} style={{position: 'relative'}} className='my-10 p-2 rounded-md bg-black text-white'>
                  <div style={{position: 'absolute'}} className='top-[-31px] left-0 bg-blue-600 my-2 px-2 rounded-t-md font-semibold'>
                    {user.userType.toUpperCase()}
                  </div>
                  {user.containerNumber && (
                    <div style={{position: 'absolute'}} className='top-[-31px] right-0 bg-blue-600 my-2 px-2 rounded-t-md font-semibold'>
                   No. {user.containerNumber.toUpperCase()}
                  </div>
                  )}
                  <div>
                   UserName - <span className='font-semibold'>{user.username}</span><br/>
                  Email - <span className='font-semibold'>{user.email}</span>
                  </div>
                  
                </div>
              ))}
            </div>
          )}
    </div>
  )
}

export default AdminDashPage;