import React, {useState} from 'react'

const AdminAddress = () => {
  const [address, setAddress] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/saveAddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name, address, email}),
      });

      // Parse the JSON response
      const data = await response.json();
      console.log(data);
      setAddress('')
      setEmail('')
      setName('')
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
        <form className='m-5' onSubmit={handleSubmit}>
            <div>
            <label htmlFor="username" className='font-semibold'>Name</label>
            <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder='Enter Username' className='input outline-none mb-3' id='username' required />
            </div>
            <div>
            <label htmlFor="email" className='font-semibold'>Email</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Enter Email' className='input outline-none mb-3' id='email' required/>
            </div>
            <div>
            <label htmlFor="address" className='font-semibold'>Address</label>
            <input type="text" value={address} onChange={(e)=>setAddress(e.target.value)} placeholder='Enter address' className='input outline-none mb-3' id='address' required/>
            </div>

            <button type='submit' className='btn mt-3'>Submit</button>
        </form>
    </div>
  )
}

export default AdminAddress