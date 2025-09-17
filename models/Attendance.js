const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }, // optional (for subject-wise attendance)
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // who marked attendance
  records: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      status: { type: String, enum: ['present', 'absent', 'late', 'leave'], default: 'present' },
      remarks: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
