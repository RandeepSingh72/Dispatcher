import React, {useState, useEffect} from 'react'
import { useAuth } from '../context/AuthContext';

const NewJob = () => {
  const [jobs, setJobs] = useState([]);
  const [jobStage, setJobStage] = useState('accept');
  const [jobId, setJobId] = useState([]);
  const {user} = useAuth();

  const handleAccept = async(jobId, jobStage) => {
    try {
      const response = await fetch('https://dispatcher-container.onrender.com/api/updateStatus', {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId,
          jobStage
        }),
      });
       await response.json();
    } catch (error) {
      console.log(error);
    }
   }


  const handleButtonClick = () => {
    switch (jobStage) {
      case 'accept':
        setJobStage('uplift')
        // Implement logic for 'Accept Job' stage
       handleAccept(jobId, jobStage);
        break;
      case 'uplift':
        setJobStage('offload');
        // Implement logic for 'Uplift Job' stage
        handleAccept(jobId, jobStage)
        break;
      case 'offload':
        setJobStage('done');
        // Implement logic for 'Offload Job' stage
        handleAccept(jobId, jobStage)
        break;
        case 'done':
        setJobStage('Thanks');
        // Implement logic for 'Offload Job' stage
        handleAccept(jobId, jobStage)
        break;
      // Add more cases for additional stages
      default:
        handleAccept(jobId, jobStage)
        break;
    }
  };

  const fetchJob = async (containerNumber) => {
    try {
      const response = await fetch(`https://dispatcher-container.onrender.com/api/container-job?containerNumber=${containerNumber}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const containerJob = await response.json();
      setJobs(containerJob.jobs)
      console.log(containerJob.jobs[0].status);
      setJobId(containerJob.jobs.length > 0 && containerJob.jobs[0]._id)
      if (containerJob.jobs[0].status && containerJob.jobs[0].status.length > 0) {
        const lastStatus = containerJob.jobs[0].status[containerJob.jobs[0].status.length - 1];
  console.log(lastStatus);
        if (lastStatus.type === 'accept') {
          setJobStage('uplift');
        } if (lastStatus.type === 'uplift') {
      
          setJobStage('offload');
        }
        if (lastStatus.type === 'offload') {
          
          setJobStage('done');
        }
        if (lastStatus.type === 'done') {
          
          setJobStage('Thanks');
        }
      } else {
        setJobStage('accept'); // Default to 'accept' if status is empty
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
     fetchJob(user.containerNumber);
  }, [])

  useEffect(()=>{
    fetchJob(user.containerNumber);
 }, [jobStage])
  return (
    <div className='p-5 m-2'>
        {jobs.length !== 0 ? jobs.map((job)=>(
                <div key={job._id} style={{position: 'relative'}} className='bg-white p-2 font-semibold rounded-md mt-10'>
                    {job.status.length !== 0 ? (
                       <div
                       style={{ position: "absolute" }}
                       className="top-[-46px] left-0 bg-blue-600 text-white my-2 px-2 rounded-t-md font-semibold"
                     >
                      <div className='p-2'>
                        Status: {job.status[job.status.length-1].type}
                      </div>
                      </div>) : (
                        <div style={{ position: "absolute" }}
                        className="top-[-46px] left-0 bg-blue-600 text-white my-2 px-2 rounded-t-md font-semibold">
                            <div className='p-2'>
                        Status: Pending
                      </div>
                        </div>
                      )}
                  <div className='grid sm:grid-cols-2 grid-cols-1 px-2 mt-4'>
                    <div>
                    <div>
                  Start Date - <span className='font-normal'>{job.jobStart}</span> 
                  </div>
                  <div>
                  PIN - <span className='font-normal'>{job.pin}</span> 
                  </div>
                  <div>
                  Commodity Code - <span className='font-normal'>{job.commodityCode}</span> 
                  </div>
                  <div>
                  Doors - <span className='font-normal'>{job.doors}</span> 
                  </div>
                  <div>
                  Slot - <span className='font-normal'>{job.slot}</span> 
                  </div>
                  <div>
                  DG - <span className='font-normal'>{job.dg}</span> 
                  </div>
                    </div>

                    <div>
                    <div>
                  Uplift Address - <span className='font-normal'>{job.uplift}</span> 
                  </div>
                  <div>
                  Offload Address - <span className='font-normal'>{job.offload}</span> 
                  </div>
                  <div>
                  Size - <span className='font-normal'>{job.size}ft.</span> 
                  </div>
                  <div>
                  Release - <span className='font-normal'>{job.release}</span> 
                  </div>
                  <div>
                  Random - <span className='font-normal'>{job.random}</span> 
                  </div>
                  <div>
                  Weight - <span className='font-normal'>{job.weight} kg</span> 
                  </div>
                    </div>

                  </div>
                 <div className='px-2 mt-1'>
                 <span className="font-bold">Special Instructions:</span>
                  <br/>
                  <span className='text-lg font-normal'>{job.instructions}</span>
                 </div>
                 <div className='px-2 mt-2 font-semibold rounded-md text-black'>
                  <div className='flex justify-center items-center'>
                  {job.status.map((e, index)=>(
                    <div key={e._id}><span className='capitalize'>{e.type}</span> - {new Intl.DateTimeFormat('en-US', {
                      year: 'numeric',
                      month: 'short', // Use 'short' to get the month in abbreviated form (e.g., Jan, Feb)
                      day: '2-digit',
                      timeZone: 'IST' // Adjust this according to your requirements
                    }).format(new Date(e.timestamp)).replace(/(\w+)\s+(\d+),\s*(\d+)/, '$2-$1-$3')}
                    {index !== job.status.length - 1 && ' > '}
                    </div>
                  ))}
                  </div>
                 </div>

                 <div className='flex items-center justify-center my-5'>
                  <div>
                  <button className={`stage-btn ${jobStage === 'Thanks' && 'cursor-not-allowed opacity-50 pointer-events-none'} ${jobStage === 'accept' && 'bg-gradient-to-r from-[#69a875] to-[#2bdb03be]'} ${jobStage === 'uplift' && 'bg-gradient-to-r from-[#8779c4] to-[#5f3cffe4]'} ${jobStage === 'offload' && 'bg-gradient-to-r from-[#f293ff] to-[#0e1afebe]'} ${jobStage === 'done' && 'bg-gradient-to-r from-[#ff2c2c] to-[#0751ff]'}`} onClick={handleButtonClick}>
                  {jobStage === 'accept' && 'Accept Job'}
                  {jobStage === 'uplift' && 'Uplift Done'}
                  {jobStage === 'offload' && 'Offload Done'}
                  {jobStage === 'done' && 'Job Done'}
                  {jobStage === 'Thanks' && '✔'}
                  </button>
                  </div>
                 </div>
                </div>
              )) : (
                <div className='items-center'>
                  No Job Available At This Time.
                </div>
              )}
    </div>
  )
}

export default NewJob