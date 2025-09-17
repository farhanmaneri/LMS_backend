const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g. "Midterm English Test"
  description: String,
  type: { type: String, enum: ['exam', 'quiz', 'assignment'], default: 'exam' },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalMarks: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  submissions: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    obtainedMarks: Number,
    answers: String, // for assignments/online answers
    submittedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);
