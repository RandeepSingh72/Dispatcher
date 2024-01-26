import React, {useState} from 'react'

const AdminUser = () => {
  const [userType, setUserType] = useState('container');
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [containerNumber, setContainerNumber] = useState('');
  const [message, setMessage] = useState('');
  const [containerMessage, setContainerMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userType === 'container') {
      try {
        const response = await fetch('https://dispatcher-container.onrender.com/api/saveUser', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({username, email, password, containerNumber, userType}),
        });
  
        // Parse the JSON response
        const data = await response.json();

        if (data.success === true) {
          setContainerNumber(''),setEmail(''),setPassword(''),setUserName(''),setUserType('container'),setMessage(''),setContainerMessage('')
        }
         if(data.code === 'container') {
          setContainerMessage(data.message)
        }
        if (data.code !== 'container') {
          setContainerMessage('')
        }
        if(data.code === 'user') {
          setMessage(data.message)
        }
        if(data.code !== 'user') {
          setMessage('')
        }
  
        // Handle the response (you can log it to the console for now)
        
      } catch (error) {
        console.log(error);
      }
    }else{
      try {
        const response = await fetch('https://dispatcher-container.onrender.com/api/saveUser', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({username, email, password, userType}),
        });
  
        // Parse the JSON response
        const data = await response.json();

        if (data.success === true) {
          setContainerNumber(''),setEmail(''),setPassword(''),setUserName(''),setUserType('container'),setMessage(''),setContainerMessage('')
        } 
        if(data.code === 'container') {
          setContainerMessage(data.message)
        }
        if(data.code === 'user') {
          setMessage(data.message)
        }
        if(data.code !== 'user') {
          setMessage('')
        }
  
        // Handle the response (you can log it to the console for now)
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <div>
      <form className='m-5' name='create-form' onSubmit={handleSubmit}>
      <div className='mb-3'>
         <span className='font-semibold text-lg'>Please Select UserType</span> 
         <br/>
          <select
           value={userType}
           onChange={(e) => setUserType(e.target.value)}
           className='rounded-md p-2 bg-white ring-1 ring-blue-500 ring-opacity-2 focus:outline-none '
          >
            <option value="container">Driver/Container</option>
            <option value="dispatcher">Dispatcher</option>
          </select>
        </div>
       {userType === 'container' && (<div className='mb-3'>
        <label htmlFor="container-number" className='font-semibold'>
          Container Number
        </label>
        <input type="text" id="container-number" value={containerNumber} onChange={(e)=>setContainerNumber(e.target.value)} required placeholder='Enter Number' className='input outline-none' />
        <span className='text-red-500'>{containerMessage}</span>
        </div>
        )}
        <div className='mb-3'>
        <label htmlFor="username" className='font-semibold'>
          UserName 
        </label>
        
        <input type="text" value={username} onChange={(e)=>setUserName(e.target.value)} id="username" required placeholder='Enter Username' className='input outline-none'/>
        <span className='text-red-500'>{message}</span> 
        </div>
        <div>
        <label htmlFor="email" className='font-semibold'>
         Email
        </label>
        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Enter Email' required id="email" className='input outline-none mb-3'/>
        </div>
        <div>
        <label htmlFor="password" className='font-semibold'>
         Password
        </label>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Enter Password' required id="password" className='input outline-none mb-3'/>
        </div>
        
        
        <button className='btn my-5' type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default AdminUser