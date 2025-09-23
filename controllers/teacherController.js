const Class = require("../models/Class");
const Subject = require("../models/Subject");
const User = require("../models/User");
const Exam = require("../models/Exam");
const Result = require("../models/Result");

// 📌 Get classes assigned to a teacher
const getMyClasses = async (req, res) => {
  const teacherId = req.user?.id; // safe check

  if (!teacherId) {
    return res.status(401).json({ message: "User not authorized" });
  }

  const classes = await Class.find({ teacher: teacherId });

  if (!classes.length) {
    return res
      .status(200)
      .json({ message: "No classes assigned yet", classes: [] });
  }

  res.json(classes);
};



// 📌 Get subjects assigned to a teacher
const getMySubjects = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const subjects = await Subject.find({ teacher: teacherId }).populate(
      "classes"
    );
    res.json(subjects);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching subjects", error: err.message });
  }
};

// 📌 Get students of teacher’s classes
const getMyStudents = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const classes = await Class.find({ teachers: teacherId }).select("_id");
    const classIds = classes.map((c) => c._id);

    const students = await User.find({
      classId: { $in: classIds },
      role: "student",
    });
    res.json(students);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching students", error: err.message });
  }
};

// 📌 Get exams created by teacher
const getMyExams = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const exams = await Exam.find({ teacher: teacherId }).populate(
      "classId subject"
    );
    res.json(exams);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching exams", error: err.message });
  }
};

// 📌 Create exam
const createExam = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { title, description, type, subject, classId, totalMarks, date } =
      req.body;

    const exam = await Exam.create({
      title,
      description,
      type,
      subject,
      classId,
      teacher: teacherId,
      totalMarks,
      date,
    });

    res.status(201).json(exam);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating exam", error: err.message });
  }
};

// 📌 Get results of teacher’s students
const getMyStudentsResults = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const classes = await Class.find({ teachers: teacherId }).select("_id");
    const classIds = classes.map((c) => c._id);

    const results = await Result.find({ classId: { $in: classIds } }).populate(
      "student subject exam"
    );
    res.json(results);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching results", error: err.message });
  }
};

module.exports = {
  getMyClasses,
  getMySubjects,
  getMyStudents,
  getMyExams,
  createExam,
  getMyStudentsResults,
};
