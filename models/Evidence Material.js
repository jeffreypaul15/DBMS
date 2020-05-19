const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EvidenceSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  class: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  dimentions: {
    type: String,
    required: true
  },
  department_name: {
    type: Schema.Types.String, ref:'Location'
  },
  source: {
    type: String,
    required: true
  },
});

const Evidence = mongoose.model('EvidenceMaterial', EvidenceSchema, 'Evidence Materal');

module.exports = Evidence;
