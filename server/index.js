const express = require('express');
require('dotenv').config()
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express()
const port = process.env.PORT ||  10000;
const cors = require('cors');
const User = require('./models/usersModel');
const Address = require('./models/address');
const { default: mongoose } = require('mongoose');
const Job = require('./models/jobModel');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://dancing-creponne-6105fd.netlify.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
   res.send('Hello, your backend is working!');
});
/*
const addAdminUser = async () => {
   const username = 'admin113';
   const password = 'admin@552';
   const email = 'anyon@gmail.com';
  await mongoose.connect(process.env.MONGODB_URL)
   try {
     // Check if the admin user already exists
     const existingAdmin = await User.findOne({ username });
     if (existingAdmin) {
       console.log('Admin user already exists.');
       return;
     }
 
     // Hash the password before creating the admin user
     const hashedPassword = await bcrypt.hash(password, 10);
 
     // Create a new admin user
     const admin = new User({ username, password: hashedPassword, email });
     await admin.save();
 
     console.log('Admin user added successfully.');
   } catch (error) {
     console.error('Error adding admin user:', error);
   } finally {
     mongoose.connection.close();
   }
 };
 */
 
 app.post('/api/userlogin', async(req, res) => {
  await mongoose.connect(process.env.MONGODB_URL)
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the entered password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Create a JWT token with user information
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.SECRET_KEY
    );

    // Respond with the token and user information
    res.json({
      token,
      user: {userId:user._id, username: user.username, email: user.email, userType: user.userType},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

app.get('/api/user', async (req, res) => {
 try {
   await mongoose.connect(process.env.MONGODB_URL);

   const token = req.headers.authorization?.replace('Bearer ', '');

   if (!token) {
     return res.status(401).json({ message: 'Unauthorized' });
   }

   const decoded = await jwt.verify(token, process.env.SECRET_KEY);
   const user = await User.findOne({ _id: decoded.userId });

   if (!user) {
     return res.status(404).json({ message: 'User not found' });
   }
   const response = {
     userId: user._id,
     username: user.username,
     email: user.email,
     userType: user.userType,
   };

   if (user.containerNumber) {
     response.containerNumber = user.containerNumber;
   }

   res.json(response);
 } catch (error) {
   res.status(401).json({ message: 'Invalid token' });
 }
});

app.post('/api/saveUser', async(req, res) => {
 const {username, email, password, containerNumber, userType} = req.body; 
 await mongoose.connect(process.env.MONGODB_URL)
  try {
    // Check if the admin user already exists
    const isUser = await User.findOne({ username });
    if (containerNumber !== undefined) {
     const isContainer = await User.findOne({containerNumber});
     if (isContainer) {
       res.json({code: 'container', message: 'This Container Number is Already Exists, Please Select Different'})
       return;
      }
    }
    if (isUser) {
      res.json({code: 'user', message: 'This Username is Already Exists, Please Select Another'})
      return;
    }
   

    // Hash the password before creating the admin user
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin user
    const user = new User({ username, password: hashedPassword, email, userType, containerNumber });
    await user.save();

    res.json({success: true, message: 'Data saved successfully'})

    console.log('User added successfully.');
  } catch (error) {
   res.status(500).json({ success: false, error: error.message });
  }
})

app.post('/api/saveAddress', async(req, res) => {
 const {address, name, email} = req.body; 
 await mongoose.connect(process.env.MONGODB_URL)
 try {
   const newAddress = new Address({name, address, email});
   await newAddress.save();
   res.json({
     success: true,
     message: 'Address saved successfully',
   });
 } catch (error) {
   res.status(500).json({ success: false, error: error.message });
 }
})

app.get('/api/allUsers', async(req, res) => {
 await mongoose.connect(process.env.MONGODB_URL)
 try {
   const users = await User.find({ userType: { $ne: 'admin' } });

   res.json({
     success: true,
     message: 'Users fetched successfully',
     users,
   });
 } catch (error) {
   res.status(500).json({ success: false, error: error.message });
 }
})

app.post('/api/createJob', async (req, res) => {
 await mongoose.connect(process.env.MONGODB_URL)
 const {uplift, offload, jobStart, size, release, slot, pin, random, doors, commodityCode, instructions, dg, weight} = req.body;
 try {
   const createJob = new Job({uplift, offload, jobStart, size, release, slot, pin, random, doors, commodityCode, dg, weight, instructions, complete: 'no'});
   await createJob.save();
   res.json({success: true, message: 'Job Created Successfully'});
 } catch (error) {
   console.error(error);
   res.status(500).send('Server Error');
 }
});

app.get('/api/addressOptions', async(req, res) => {
 await mongoose.connect(process.env.MONGODB_URL)
 try {
   const addresses = await Address.find({});

   res.json({addresses});
 } catch (error) {
   res.status(500).json({ success: false, error: error.message });
 }
})

app.get('/api/allJobs', async(req, res) => {
 await mongoose.connect(process.env.MONGODB_URL)
 try {
   const jobs = await Job.find({complete: 'no'});

   res.json({
     success: true,
     message: 'Users fetched successfully',
     jobs,
   });
 } catch (error) {
   res.status(500).json({ success: false, error: error.message });
 }
})

app.get('/api/unassigned', async(req, res) => {
 await mongoose.connect(process.env.MONGODB_URL)
 try {
   const unassignedContainers = await User.find(
     { userType: 'container', $or: [{ assigned: 'no' }, { assigned: { $exists: false } }] },
     'containerNumber assigned'
   );
   res.json(unassignedContainers);
 } catch (error) {
   res.status(500).json({ success: false, error: error.message });
 }
})

app.put('/api/updateJob', async(req, res) => {
 await mongoose.connect(process.env.MONGODB_URL)
 const {selectedContainer, jobId} = req.body;
 try {
   const updatedJob = await Job.findByIdAndUpdate(jobId, { containerNum: selectedContainer});

   if (!updatedJob) {
     return res.status(404).json({ error: 'Job not found' });
   }
   res.json(updatedJob);
 } catch (error) {
   res.status(500).json({ success: false, error: error.message });
 }
})

app.put('/api/assign-container', async(req, res) => {
 await mongoose.connect(process.env.MONGODB_URL)
 const {selectedContainer} = req.body;
 try {
   const assignedValue = 'yes';
   

   // Find the user by container number
   const updatedUser = await User.findOneAndUpdate(
     { containerNumber: selectedContainer },
     { $set: { assigned: assignedValue } },
     { new: true, upsert: true }
   );

   res.json(updatedUser);
 } catch (error) {
   res.status(500).json({ success: false, error: error.message });
 }
})

app.get('/api/container-job', async(req, res) => {
 try {
   await mongoose.connect(process.env.MONGODB_URL);

   const { containerNumber } = req.query;

   if (!containerNumber) {
     return res.status(400).json({ message: 'Container number is required' });
   }

   const jobs = await Job.find({ containerNum: containerNumber, complete: 'no' });

   res.json({ jobs });
 } catch (error) {
   res.status(500).json({ success: false, error: error.message });
 }
})

app.put('/api/updateStatus', async(req, res) => {
 await mongoose.connect(process.env.MONGODB_URL)
 const {jobId, jobStage} = req.body;
 try {
   // Find the user by container number
   if (!['accept', 'uplift', 'offload', 'done'].includes(jobStage)) {
     return res.status(400).json({ success: false, error: 'Invalid jobStage' });
   }

   const completeValue = jobStage === 'done' ? 'yes' : 'no';

   // Find the job by its unique identifier (_id) and update its status
   const updatedJob = await Job.findByIdAndUpdate(
     jobId,
     {
       $push: {
         status: {
           type: jobStage,
           timestamp: Date.now(),
         },
       },
       complete: completeValue,
     },
     { new: true }
   );

   if (!updatedJob) {
     return res.status(404).json({ success: false, error: 'Job not found' });
   }

   // Update the user's assigned field to 'no' when the job stage is 'done'
   if (jobStage === 'done' && updatedJob.containerNum) {
     await User.findOneAndUpdate(
       { containerNumber: updatedJob.containerNum },
       { assigned: 'no' }
     );
   }

   res.json({ success: true, job: updatedJob });
 } catch (error) {
   res.status(500).json({ success: false, error: error.message });
 }
})

app.get('/api/jobs/complete', async (req, res) => {
 try {
   await mongoose.connect(process.env.MONGODB_URL);

   // Find jobs with complete value 'yes'
   const completedJobs = await Job.find({ complete: 'yes' });

   res.json({ success: true, jobs: completedJobs });
 } catch (error) {
   res.status(500).json({ success: false, error: error.message });
 }
});

app.get('/api/container-complete-job', async(req, res) => {
 try {
   await mongoose.connect(process.env.MONGODB_URL);

   const { containerNumber } = req.query;

   if (!containerNumber) {
     return res.status(400).json({ message: 'Container number is required' });
   }

   const jobs = await Job.find({ containerNum: containerNumber, complete: 'yes' });

   res.json({ jobs });
 } catch (error) {
   res.status(500).json({ success: false, error: error.message });
 }
})

app.get('/api/jobs/all', async(req, res) => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const jobs = await Job.find({});
    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
})
 // Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
