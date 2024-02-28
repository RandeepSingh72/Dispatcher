import React, {useState, useEffect, useRef} from 'react'
import { DownloadTableExcel } from 'react-export-table-to-excel';

const ExcelJob = () => {
  const [allJobs, setAllJobs] = useState([]);
  const tableRef = useRef(null);
  const [container, setContainer] = useState({});
  const [containers, setContainers] = useState([]);
  const [updates, setUpdates] = useState([])

  const getColorBasedOnDate = (jobStartDate, containerNum) => {
    const jobStart = new Date(jobStartDate);
    const today = new Date();
    const differenceInMilliseconds = jobStart.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInMilliseconds / (24 * 60 * 60 * 1000));
   
    // If today is one day away from jobStart, change color
    if (differenceInDays === 1 && !containerNum) {
      return {
        backgroundColor: '#DD0404', // Set your desired background color here
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

  const jobsWithDaysDifference = allJobs.map((job) => {
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

  const getAllJobs = async () => {
    try {
      const response = await fetch("https://dispatcher-container.onrender.com/api/jobs/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data.jobs);
      setAllJobs(data.jobs)
    } catch (error) {
      console.log(error);
    }
  }

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
    setUpdates(updatedJob, updateUser)
    console.log('Job updated successfully:', updatedJob);

    } catch (error) {
      console.log(error);
    }
  };


  useEffect(()=>{
    getAllJobs()
    fetchContainer()
  }, [])

  useEffect(() => {
    getAllJobs()
    fetchContainer();
  }, [updates]);

  return (
    <div>
       <DownloadTableExcel
                    filename="jobs table"
                    sheet="jobs"
                    currentTableRef={tableRef.current}
                >
                   <button className='btn mt-3 ml-4'>Export Excel</button>
        </DownloadTableExcel>
        <div className='m-5 bg-white rounded-xl'>
            <div className='overflow-x-auto p-4'>
            <table ref={tableRef} className='custom-table'>
                 <tbody>
                    <tr>
                        <th>Start Date</th>
                        <th>Pin:</th>
                        <th>Booking Slot:</th>
                        <th>Commmodity Code:</th>
                        <th>Size</th>
                        <th>DG</th>
                        <th>Uplift Address:</th>
                        <th>Offload Address:</th>
                        <th>Doors:</th>
                        <th>Random:</th>
                        <th>Release:</th>
                        <th>Weight</th>
                        <th>Sp. Instructions</th>
                        <th>Assign Con.</th>
                    </tr>
                    {sortedJobs.map((job)=>{
                      const { backgroundColor, textColor } = getColorBasedOnDate(job.jobStart, job.containerNum);
                      return(
                        <tr key={job._id} style={{ backgroundColor, color: textColor}}>
                        <td>{job.jobStart}</td>
                        <td>{job.pin}</td>
                        <td>{job.slot}</td>
                        <td>{job.commodityCode}</td>
                        <td>{job.size}</td>
                        <td>{job.dg}</td>
                        <td>{job.uplift}</td>
                        <td>{job.offload}</td>
                        <td>{job.doors}</td>
                        <td>{job.random}</td>
                        <td>{job.release}</td>
                        <td>{job.weight}</td>
                        <td>{job.instructions}</td>
                        {job.containerNum ? (
                          <td>{job.containerNum}</td>
                        ) : (
                          <td>
                            <form onSubmit={(e)=>handleAssign(e, job._id)} className="flex items-center min-w-full">
                            <select
                          value={container[job._id] || ""}
                          required
                          onChange={(e) => setContainer({ ...container, [job._id]: e.target.value })}
                          className="rounded-md p-2 bg-white text-black ring-1 ring-blue-500 ring-opacity-2 focus:outline-none my-3 ml-1 min-w-50"
                        >
                          <option value="" disabled>
                            Select Container
                          </option>
                          {containers && containers.map((cont) => (
                            <option key={cont._id} value={cont.containerNumber}>{cont.containerNumber}</option>
                          ))}
                        </select>
                        <button type="submit" className="bg-black m-2.5 text-white py-1 px-4 rounded-md">Assign</button>
                            </form>
                          </td>
                        )}
                      </tr>
                     )})}
                  </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}

export default ExcelJob;