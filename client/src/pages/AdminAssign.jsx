import React, {useState, useEffect} from 'react'

const AdminAssign = () => {
  const [jobs, setJobs] = useState([]);
  const [container, setContainer] = useState({});
  const [containers, setContainers] = useState([]);
  const [update, setUpdate] = useState([])
  
  const getColorBasedOnDate = (jobStartDate, containerNum) => {
    const jobStart = new Date(jobStartDate);
    const today = new Date();
    const differenceInMilliseconds = jobStart.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInMilliseconds / (24 * 60 * 60 * 1000));
   
    // If today is one day away from jobStart, change color
    if (differenceInDays === 1 && !containerNum) {
      return {
        backgroundColor: '#EE5938', // Set your desired background color here
        textColor: 'white', // Set your desired text color here
      };
    }
  
    // Default colors
    return {
      backgroundColor: 'white',
      textColor: 'black',
    };
    
  };
  

  const calculateDaysDifference = (date1, date2) => {
    const differenceInMilliseconds = Math.abs(date1.getTime() - date2.getTime());
    return Math.ceil(differenceInMilliseconds / (24 * 60 * 60 * 1000));
  };

  const jobsWithDaysDifference = jobs.map((job) => {
    const jobStart = new Date(job.jobStart);
    const today = new Date();
    const daysDifference = calculateDaysDifference(today, jobStart);
  
    return { ...job, daysDifference };
  });
  
  const sortedJobs = jobsWithDaysDifference.sort((a, b) => {
    if (!a.containerNum && b.containerNum) {
      return -1;
  }
  // If a job is assigned and b job is not assigned, b should come before a
  if (a.containerNum && !b.containerNum) {
      return 1;
  }
  // If both jobs are either assigned or not assigned, sort by daysDifference
  return a.daysDifference - b.daysDifference;
  })


  const fetchAllJobs = async () => {
    try {
      const response = await fetch("https://dispatcher-container.onrender.com/api/allJobs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const allJobs = await response.json();
      setJobs(allJobs.jobs);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchContainer = async() => {
    try {
      const response = await fetch("https://dispatcher-container.onrender.com/api/unassigned", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const containers = await response.json();
      setContainers(containers)
    } catch (error) {
      console.log(error);
    }
  }

  const handleAssign = async (e, jobId) => {
    e.preventDefault();

    const selectedContainer = container[jobId];

    try {
      const response = await fetch('https://dispatcher-container.onrender.com/api/updateJob', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        selectedContainer,
        jobId,
      }),
    });

    const response2 = await fetch('https://dispatcher-container.onrender.com/api/assign-container', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        selectedContainer
      }),
    })

    if (!response.ok && !response2.ok) {
      throw new Error('Failed to update job');
    }

    const updatedJob = await response.json();
    const updateUser = await response2.json()
    setUpdate(updatedJob, updateUser)
    console.log('Job updated successfully:', updatedJob);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllJobs();
    fetchContainer()
  }, []);

  useEffect(() => {
    fetchAllJobs();
    fetchContainer();
  }, [update]);
  return (
    <div className='m-5'>
            {jobs &&
              sortedJobs.map((job) => {
                const { backgroundColor, textColor } = getColorBasedOnDate(job.jobStart, job.containerNum);
                return (
                <div
                  key={job._id}
                  style={{ position: "relative", backgroundColor, color: textColor}}
                  className={`${job.containerNum ? 'mt-12' : 'mt-24'} px-5 pb-4 pt-1 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl`}
                >
                    {job.containerNum ? (
                       <div
                       style={{ position: "absolute" }}
                       className="top-[-31px] left-0 bg-blue-600 my-2 px-2 rounded-t-md font-semibold text-white"
                     >
                      <div>
                        Container No. {job.containerNum}
                      </div>
                      </div>
                    ):(
                      <div
                      style={{ position: "absolute" }}
                      className="top-[-70px] left-0 bg-blue-600 my-2 px-1 rounded-t-md font-semibold"
                    >
                      <form onSubmit={(e)=>handleAssign(e, job._id)}>
                      <div className="text-black flex flex-row">
                        <select
                          value={container[job._id] || ""}
                          required
                          onChange={(e) => setContainer({ ...container, [job._id]: e.target.value })}
                          className="rounded-md p-2 bg-white ring-1 ring-blue-500 ring-opacity-2 focus:outline-none my-3 ml-1 w-full"
                        >
                          <option value="" disabled>
                            Select Container
                          </option>
                          {containers && containers.map((cont) => (
                            <option key={cont._id} value={cont.containerNumber}>{cont.containerNumber}</option>
                          ))}
                        </select>
                        <button type="submit" className="bg-black m-2.5 text-white py-1 px-4 rounded-md">Assign</button>
                      </div>
                    </form>
                    </div>
                    )}
                  <div className="font-semibold mt-4 grid sm:grid-cols-2 grid-cols-1">
                    <div>
                    <div >
                    Start Date - <span className="font-normal">{job.jobStart}</span>
                    <br />
                  </div>
                  <div>
                    PIN - <span className='font-normal'>{job.pin}</span>
                  </div>
                  <div>
                    Slot - <span className='font-normal'>{job.slot}</span>
                  </div>
                  <div>
                    Commodity Code - <span className="font-normal">{job.commodityCode}</span>
                  </div>
                  <div>
                    Size - <span className="font-normal">{job.size} ft.</span>
                  </div>
                  <div>
                    DG - <span className="font-normal">{job.dg}</span>
                  </div>
                    </div>

                    <div> 
                    <div >
                    Uplift Address - <span className="font-normal">{job.uplift}</span>
                    <br />
                  </div>
                  <div >
                    Offload Address - <span className="font-normal">{job.offload}</span>
                    <br />
                  </div>
                  <div >
                    Doors - <span className="font-normal">{job.doors}</span>
                    <br />
                  </div>
                  <div >
                    Random - <span className="font-normal">{job.random}</span>
                    <br />
                  </div>
                  <div >
                    Release - <span className="font-normal">{job.release}</span>
                    <br />
                  </div>
                  <div>
                    Weight - <span className="font-normal">{job.weight} Kg</span>
                  </div>
                    </div>
                  
                  </div>
                  <div className="mt-1">
                  <span className="font-bold">Special Instructions:</span>
                  <br/>
                  <span className='text-lg'>{job.instructions}</span>
                  </div>
                  <div className='px-2 mt-2 font-semibold bg-purple-400 rounded-md text-white'>
                  <div className='flex items-center justify-center '>
                  Status
                  </div>
                  <div className='flex flex-wrap gap-2'>
                  {job.status.map((e)=>(
                    <div key={e.type}><span className='capitalize'>{e.type}</span> - {new Intl.DateTimeFormat('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      timeZone: 'IST' // Adjust this according to your requirements
                    }).format(new Date(e.timestamp)).replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2')},</div>
                  ))}
                  </div>
                 </div>
                  
                </div>
)})}
          </div>
  )
}

export default AdminAssign