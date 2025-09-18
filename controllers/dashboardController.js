// dashboardController.js
const ClassModel = require("../models/Class.js");
const Exam = require("../models/Exam");
const Result = require("../models/Result.js");
const Attendance = require("../models/Attendance");
const User = require("../models/User.js");

const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "classId subjects assignedClasses"
    );

    let dashboardData = {};

    if (user.role === "admin") {
      dashboardData = {
        message: "Welcome Admin",
        stats: {
          totalTeachers: await User.countDocuments({ role: "teacher" }),
          totalStudents: await User.countDocuments({ role: "student" }),
          totalClasses: await ClassModel.countDocuments(),
        },
        recentClasses: await ClassModel.find()
          .limit(5)
          .populate("subjects teachers"),
      };
    }

    if (user.role === "teacher") {
      dashboardData = {
        message: "Welcome Teacher",
        teacherName: user.name,
        assignedClasses: user.assignedClasses,
        subjects: user.subjects,
        upcomingExams: await Exam.find({ teacher: user._id }).limit(5),
        recentAttendance: await Attendance.find({ teacher: user._id }).limit(5),
      };
    }

    if (user.role === "student") {
      dashboardData = {
        message: "Welcome Student",
        studentName: user.name,
        class: user.classId,
        subjects: await ClassModel.findById(user.classId).populate("subjects"),
        results: await Result.find({ student: user._id })
          .populate("subject exam")
          .limit(5),
        attendance: await Attendance.find({
          "records.student": user._id,
        }).limit(10),
      };
    }

    res.json(dashboardData);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching dashboard", error: err.message });
  }
};
module.exports={getDashboard}