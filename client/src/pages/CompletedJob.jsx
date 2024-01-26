import React, {useState, useEffect} from 'react'

const CompletedJob = () => {
  const [completeJobs, setCompleteJobs] = useState([])

  const getCompleteJobs = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/jobs/complete", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const complete = await response.json();
      setCompleteJobs(complete.jobs)
      console.log(complete.jobs);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getCompleteJobs()
  }, [])

  return (
    <div className='m-5'>
              {completeJobs.length !== 0 ? completeJobs.map((job)=>(
                <div key={job._id} style={{position: 'relative'}} className='bg-black text-white p-2 font-semibold rounded-md mt-10'>
                  {job.containerNum ? (
                       <div
                       style={{ position: "absolute" }}
                       className="top-[-31px] left-0 bg-blue-600 my-2 px-2 rounded-t-md font-semibold"
                     >
                      <div>
                        Container No. {job.containerNum}
                      </div>
                      </div>) : ""}
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

                </div>
              )) : (
                <div className='items-center'>
                  No Job Completed Yet.
                </div>
              )}
            </div>
  )
}

export default CompletedJob;