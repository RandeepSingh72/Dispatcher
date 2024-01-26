import React, {useState, useEffect} from 'react'

const CreateJob = () => {
  const [uplift, setUplift] = useState('');
  const [offload, setOffload] = useState('');
  const [jobStart, setJobStart] = useState('');
  const [size, setSize] = useState('20');
  const [release, setRelease] = useState('')
  const [slot, setSlot] = useState('');
  const [pin, setPin] = useState('');
  const [random, setRandom] = useState('')
  const [doors, setDoors] = useState('')
  const [commodityCode, setCommodityCode] = useState('')
  const [instructions, setInstructions] = useState('')
  const [options, setOptions] = useState([])

  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://dispatcher-container.onrender.com/api/createJob', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uplift,
          offload,
          jobStart,
          size,
          release,
          slot,
          pin,
          random,
          doors,
          commodityCode,
          instructions,
        }),
      });

      if (response.ok) {
        console.log('Item added successfully!');
        setUplift(''), setOffload(''), setJobStart(''), setSize('20'), setRelease(''), setSlot(''), setPin(''), setDoors(''), setCommodityCode(''), setRandom(''), setInstructions('')
      } else {
        console.error('Failed to add item.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    
  }

  useEffect(() => {
    // Fetch options from the database
    const fetchOptions = async () => {
      try {
        const response = await fetch('https://dispatcher-container.onrender.com/api/addressOptions',{
           method: 'GET',
           mode: 'cors',
           headers: {
          'Content-Type': 'application/json',
           },
        })
        if (!response.ok) {
          throw new Error('Failed to fetch options');
        }
        const data = await response.json();
        setOptions(data.addresses);
      } catch (error) {
        console.error('Error fetching uplift options:', error);
      }
    };

    fetchOptions();
  }, []);

  return (
    <div>
     <form className='m-5' onSubmit={handleSubmit}>
        <div>
          <span className='font-semibold mb-2'>Uplift Address</span> 
         <br/>
          <select
           value={uplift}
           onChange={(e) => setUplift(e.target.value)}
           className='rounded-md p-2 bg-white ring-1 ring-blue-500 ring-opacity-2 focus:outline-none my-3 w-full'
          >
            <option value="" disabled>Select Uplift Address</option>
            {options && options.map((option)=>(
              <option key={option._id} value={option.address}>{option.address}</option>
            ))}
          </select>
          </div>

          <div>
          <span className='font-semibold mb-2'>Offload Address</span> 
           <br/>
          <select
           value={offload}
           onChange={(e) => setOffload(e.target.value)}
           className='rounded-md p-2 bg-white ring-1 ring-blue-500 ring-opacity-2 focus:outline-none my-3 w-full'
          >
            <option value="" disabled>Select Offload Address</option>
            {options && options.map((option)=>(
              <option key={option._id} value={option.address}>{option.address}</option>
            ))}
          </select>
          </div>
       
        <div className='flex flex-row gap-5'>
          <div>
           <label htmlFor="start-date" className='font-semibold'>
            Start Job Date
           </label>
           <input type="date" value={jobStart} onChange={(e)=>setJobStart(e.target.value)} placeholder='Enter Start Job Date' required id="start-date" className='input outline-none mb-3'/>
          </div>

          <div>
          <span className='font-semibold mb-5'>Select Size</span> 
         <br/>
          <select
           value={size}
           onChange={(e) => setSize(e.target.value)}
           className='rounded-md p-2 bg-white ring-1 ring-blue-500 ring-opacity-2 focus:outline-none mt-3'
          >
            <option value="20">20ft</option>
            <option value="40">40ft</option>
          </select>
          </div>
        </div>
        <div>
        <label htmlFor="release" className='font-semibold'>
         Release
        </label>
        <input type="text" value={release} onChange={(e)=>setRelease(e.target.value)} placeholder='Enter Release' required id="release" className='input outline-none mb-3'/>
        </div>
        <div>
        <label htmlFor="slot" className='font-semibold'>
         VBS / Slot
        </label>
        <input type="text" value={slot} onChange={(e)=>setSlot(e.target.value)} placeholder='Enter VBS / Slot' required id="slot" className='input outline-none mb-3'/>
        </div>
        <div>
        <label htmlFor="pin" className='font-semibold'>
         PIN
        </label>
        <input type="text" value={pin} onChange={(e)=>setPin(e.target.value)} placeholder='Enter Pin' required id="pin" className='input outline-none mb-3'/>
        </div>
        <div>
        <label htmlFor="random" className='font-semibold'>
         Random
        </label>
        <input type="text" value={random} onChange={(e)=>setRandom(e.target.value)} placeholder='Enter Random' required id="random" className='input outline-none mb-3'/>
        </div>
        <div>
        <label htmlFor="doors" className='font-semibold'>
         Doors
        </label>
        <input type="text" value={doors} onChange={(e)=>setDoors(e.target.value)} placeholder='Enter Doors' required id="doors" className='input outline-none mb-3'/>
        </div>
        <div>
        <label htmlFor="commodity" className='font-semibold'>
        Commodity Code
        </label>
        <input type="text" value={commodityCode} onChange={(e)=>setCommodityCode(e.target.value)} placeholder='Enter Commodity Code' required id="commodity" className='input outline-none mb-3'/>
        </div>
        <div>
        <label htmlFor="instruction" className='font-semibold'>
        Special Instructions
        </label>
        <textarea value={instructions} onChange={(e)=>setInstructions(e.target.value)} placeholder='Enter Special Instructions' required id="instruction" className='input outline-none mb-3'/>
        </div>
        <button className='btn my-3' type='submit'>Submit</button>
     </form>
    </div>
  )
}

export default CreateJob