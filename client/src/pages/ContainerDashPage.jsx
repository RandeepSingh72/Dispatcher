import React, {useState, useEffect} from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'
import profile from '../assets/profile.svg';
import ContainerSidebar from '../components/ContainerSidebar';

const ContainerDashPage = () => {
  const {pathname} = useLocation();
  const {user} = useAuth();
  const [jobs, setJobs] = useState([]);
  const [jobStage, setJobStage] = useState('accept');
  const [jobId, setJobId] = useState([]);
  

  const handleAccept = async(jobId, jobStage) => {
    try {
      const response = await fetch('http://localhost:3000/api/updateStatus', {
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
      const response = await fetch(`http://localhost:3000/api/container-job?containerNumber=${containerNumber}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const containerJob = await response.json();
      setJobs(containerJob.jobs)
      setJobId(containerJob.jobs.length > 0 ? containerJob.jobs[0]._id : null)
      if (containerJob.jobs[0].status && containerJob.jobs[0].status.length > 0) {
        const lastStatus = containerJob.jobs[0].status[containerJob.jobs[0].status.length - 1];
  
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
    <div>
      <div className='flex justify-between items-center'>
      <ContainerSidebar/>
      <div className='flex flex-row gap-1 mr-3'>
        <div>
        <img src={profile} alt="profile" className='w-[35px] h-[35px]' />
        </div>
        <div className='text-black mt-1 capitalize font-bold'>
          {user.username}
        </div>
      </div>
      </div>
          {pathname !== '/container-dashboard' ? <Outlet/> : (
            <div className='m-5'>
              {jobs.length !== 0 ? jobs.map((job)=>(
                <div key={job._id} className='bg-black text-white p-2 font-semibold rounded-md'>
                  <div className='grid sm:grid-cols-2 grid-cols-1 px-2 mt-4'>
                    <div>
                    <div>
                  Start Date - {job.jobStart}
                  </div>
                  <div>
                  PIN - <span className='font-light'>{job.pin}</span> 
                  </div>
                  <div>
                  Commodity Code - <span className='font-light'>{job.commodityCode}</span> 
                  </div>
                  <div>
                  Doors - <span className='font-light'>{job.doors}</span> 
                  </div>
                  <div>
                  Slot - <span className='font-light'>{job.slot}</span> 
                  </div>
                    </div>

                    <div>
                    <div>
                  Uplift Address - <span className='font-light'>{job.uplift}</span> 
                  </div>
                  <div>
                  Offload Address - <span className='font-light'>{job.offload}</span> 
                  </div>
                  <div>
                  Size - <span className='font-light'>{job.size}ft.</span> 
                  </div>
                  <div>
                  Release - <span className='font-light'>{job.release}</span> 
                  </div>
                  <div>
                  Random - <span className='font-light'>{job.random}</span> 
                  </div>
                    </div>

                  </div>
                 <div className='px-2 mt-1 font-light'>
                  <span className='font-semibold'>Instructions</span> - {job.instructions}
                 </div>
                 <div className='px-2 mt-2 font-semibold bg-purple-400 rounded-md text-black'>
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

                 <div className='flex items-center justify-center my-5'>
                  <div className='w-[50%]'>
                  <button className={`btn ${jobStage === 'Thanks' ? 'cursor-not-allowed opacity-50 pointer-events-none' : ''}`} onClick={handleButtonClick}>
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
          )}
    </div>
  )
}

export default ContainerDashPage