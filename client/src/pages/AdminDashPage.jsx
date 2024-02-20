import React, {useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

const AdminDashPage = () => {
  const [users, setUsers] = useState([])
  const navigate = useNavigate()
  const {pathname} = useLocation()
  const {user, setUser } = useAuth();

  const fetchAllUsers = async() => {
    try {
      const response = await fetch('https://dispatcher-container.onrender.com/api/allUsers', {
        method: 'GET',
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
  useEffect(() => {
    fetchAllUsers()
    if (user === undefined) {
      fetchUser();
    }
    }, [pathname]);

  console.log(user);
  return (
    <div>
      <div className='flex justify-between items-center'>
      <Sidebar/>
      
      </div>
          {pathname !== '/admin-dashboard' ? <Outlet/> : (
            <div className='m-5 flex flex-row'>
              <div className='p-2 m-2 bg-white rounded-xl'>
                <div className='mr-6 ml-1'>
                <h2>Container</h2>
                <span className='font-bold'>{users.filter(user => user.userType === 'container').length}</span>
                </div>
              </div>

              <div className='p-2 m-2 bg-white rounded-xl'>
                <div className='mr-6 ml-1'>
                <h2>Dispatcher</h2>
                <span className='font-bold'>{users.filter(user => user.userType === 'dispatcher').length}</span>
                </div>
              </div>
            </div>
          )}
    </div>
  )
}

export default AdminDashPage;