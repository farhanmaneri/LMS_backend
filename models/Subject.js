const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "Math", "English"
  code: { type: String, unique: true },   // e.g. "ENG101"
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assigned teacher
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }] // Classes where subject is taught
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
