const express = require('express');
require('dotenv').config()
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express()
const port = process.env.PORT || 10000;
const cors = require('cors');
const User = require('./models/usersModel');
const Address = require('./models/address');
const { default: mongoose } = require('mongoose');
const Job = require('./models/jobModel');
const SafetyForm = require('./models/safetyForm');

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
    const userData = {
     userId: user._id,
     username: user.username,
     email: user.email,
     userType: user.userType,
   };
   
   if (user.userMainId) {
     userData.userMainId = user.userMainId;
   }
   
   res.json({
     token,
     user: userData,
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
 const {username, email, password, userMainId, userType} = req.body; 
 await mongoose.connect(process.env.MONGODB_URL)
  try {
    // Check if the admin user already exists
    const isUser = await User.findOne({ username });
    if (userMainId !== undefined) {
     const isMainId = await User.findOne({userMainId});
     if (isMainId) {
       res.json({code: 'ID', message: 'This User ID is Already Exists, Please Select Different'})
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
    const user = new User({ username, password: hashedPassword, email, userType, userMainId });
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
 const {uplift, offload, jobStart, size, release, containerNumber, slot, pin, random, doors, commodityCode, instructions, dg, weight} = req.body;
 try {
   const createJob = new Job({uplift, offload, jobStart, size, release, containerNumber, slot, pin, random, doors, commodityCode, dg, weight, instructions, complete: 'no'});
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
   const unassignedContainers = await User.find({userType: 'container'});
   res.json(unassignedContainers);
 } catch (error) {
   res.status(500).json({ success: false, error: error.message });
 }
})

app.put('/api/updateJob', async(req, res) => {
 await mongoose.connect(process.env.MONGODB_URL)
 const {selectedId, jobId} = req.body;
 try {
   const updatedJob = await Job.findByIdAndUpdate(jobId, { userMainId: selectedId});

   if (!updatedJob) {
     return res.status(404).json({ error: 'Job not found' });
   }
   res.json(updatedJob);
 } catch (error) {
   res.status(500).json({ success: false, error: error.message });
 }
})


app.get('/api/container-job', async(req, res) => {
 try {
   await mongoose.connect(process.env.MONGODB_URL);

   const { userMainId } = req.query;

   if (!userMainId) {
     return res.status(400).json({ message: 'User ID is required' });
   }

   const jobs = await Job.find({ userMainId: userMainId, complete: 'no' });

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

   const { userMainId } = req.query;

   if (!userMainId) {
     return res.status(400).json({ message: 'Container number is required' });
   }

   const jobs = await Job.find({ userMainId: userMainId, complete: 'yes' });

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

app.post('/api/safetyForm', async (req, res) => {
 const { firstName, surname, addressSite, jobNumber, fitForDuty, mealBreak, PPE, message } = req.body;

 try {
   await mongoose.connect(process.env.MONGODB_URL);
   // Create a new SafetyForm document and save it to the database
   const newForm = new SafetyForm({
     firstName,
     surname,
     addressSite,
     jobNumber,
     fitForDuty,
     mealBreak,
     PPE,
     message,
   });
   await newForm.save();

   // Send a response indicating success
   res.json({ success: true, message: 'Form data saved successfully' });
 } catch (error) {
   console.log(error);
   res.status(500).json({ success: false, message: 'Error saving form data' });
 }
});

app.get('/api/reportJobs', async(req, res) => {
 try {
   await mongoose.connect(process.env.MONGODB_URL);
   const { date } = req.query; // Assuming the date is passed as a query parameter
   if (!date) {
     return res.status(400).json({ success: false, error: 'Date parameter is required' });
   }
   const inputDate = new Date(date);

   // Extract the year, month, and day from the input date
   const year = inputDate.getFullYear();
   const month = inputDate.getMonth() + 1; // Months are zero-based in JavaScript
   const day = inputDate.getDate();

   // Construct the date string in the format YYYY-MM-DD for comparison
   const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;

   // Query MongoDB using Mongoose to fetch jobs where the 'done' date matches the input date
   const jobs = await Job.find({
     'status.type': 'done',
     'status.timestamp': {
       $gte: new Date(formattedDate), // Start of input date
       $lt: new Date(formattedDate + 'T23:59:59.999Z'), // End of input date (23:59:59.999)
     },
   });
   res.json({ success: true, data: jobs });
 } catch (error) {
   res.status(500).json({ success: false, error: error.message });
 }
})

 // Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});