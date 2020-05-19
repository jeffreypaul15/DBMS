const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LocSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  supervisor_id: {
    type: Schema.Types.String, ref:'Supervisor'
  },
  name: {
    type: String,
    required: true
  }
});

const Location = mongoose.model('Location', LocSchema, 'Location');

module.exports = Location;
