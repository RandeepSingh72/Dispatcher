const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  uplift: { type: String, required: true },
  offload: { type: String, required: true },
  jobStart: { type: String, required: true },
  size: { type: String, required: true },
  release: { type: String, required: true },
  slot: { type: String, required: true },
  pin: { type: String, required: true },
  random: { type: String, required: true },
  doors:{ type: String, required: true },
  dg:{type: String, required: true},
  weight:{type: String, required: true},
  commodityCode: { type: String, required: true },
  instructions: { type: String, required: true },
  containerNum: { type: String, required: false },
  complete: { type: String, required: false },
  status: [
    {
      type: {
        type: String,
        required: false,
        enum: ['accept', 'uplift', 'offload', 'done'],
        default:'accept',
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});
  
const Job = mongoose.model('Job', jobSchema);
  
module.exports = Job;