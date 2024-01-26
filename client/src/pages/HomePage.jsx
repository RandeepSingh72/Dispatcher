import React, {useEffect, useState} from 'react'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { isLoggedIn, user, setUser } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/userlogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token)
        setUsername('')
        setPassword('')
        if (data.user.userType === 'admin') {
          // Redirect to the admin dashboard
          navigate('/admin-dashboard');
        } if (data.user.userType === 'dispatcher') {
          // Redirect to the dispatcher dashboard
          navigate('/dispatcher-dashboard');
        }if (data.user.userType === 'container'){
          navigate('/container-dashboard');
        }
        // Handle successful login, e.g., store the token in local storage
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData.message);
        // Handle login failure, e.g., show an error message
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      // Handle other errors, e.g., network issues
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
  
        if (!token) {
          throw new Error('Token not found');
        }
  
        const response = await fetch('http://localhost:3000/api/user', {
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
    if (isLoggedIn()) {
      fetchUser();
    }
   
    
  }, []);

  return (
    <div className='p-5'>
      <form className='flex flex-col items-center w-auto md:mx-10 lg:mx-20 2xl:mx-36 mt-10' onSubmit={handleLogin}>
        <label htmlFor="username" className='w-full'>
       <span className='text-black font-semibold'>UserName</span>
        <input type="text" placeholder='Enter username' className='input outline-none mb-3' required id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label htmlFor="password" className='w-full'>
        <span className='text-black font-semibold'>Password</span>
        <input type="password" placeholder='Enter password' className='input outline-none' required id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
  
      <button type='submit' className="btn mt-5">
        Login
      </button> 
      </form>
    </div>
  )
}

export default HomePage;