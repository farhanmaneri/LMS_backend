const Attendance = require("../models/Attendance");

const addAttendance = async (req, res) => {
  try {
    const { student, classId, status } = req.body;
    const attendance = new Attendance({ student, classId, status });
    await attendance.save();
    res.status(201).json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getStudentAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ student: req.params.id })
      .populate("classId");
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports={addAttendance, getStudentAttendance}