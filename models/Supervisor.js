const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SuperSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  employee_id: {
    type: Schema.Types.ObjectId, ref:'User'
  }
});

const Supervisor = mongoose.model('Supervisor', SuperSchema, 'Supervisors');

module.exports = Supervisor;
