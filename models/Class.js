const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "Grade 3"
  section: { type: String }, // e.g. "A", "B"
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users with role=student
  teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users with role=teacher
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }] // Subjects taught in this class
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);
