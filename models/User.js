const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  dob: {
    type: String,
    required: true
  },
  access: {
    type: Boolean,
    required: true
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
