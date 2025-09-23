const User = require("../models/User");
const Class = require("../models/Class");
const Subject = require("../models/Subject");
const Exam = require("../models/Exam");
const Result = require("../models/Result");

// ========================= USER MANAGEMENT =========================

// ✅ Create new user (student/teacher/admin)
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = new User({ name, email, password, role });
    await user.save();

    const { password: _, ...userData } = user.toObject();
    res.status(201).json(userData);
  } catch (err) {
    console.error("❌ createUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all users (optionally filter by role)
const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query; // ?role=student
    const query = role ? { role } : {};
    const users = await User.find(query).select("-password");
    res.json(users);
  } catch (err) {
    console.error("❌ getAllUsers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("❌ deleteUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= CLASS MANAGEMENT =========================

// ✅ Create class
const createClass = async (req, res) => {
  try {
    const { name, section, teachers, students, subjects } = req.body;
    const newClass = new Class({ name, section, teachers, students, subjects });
    await newClass.save();
    res.status(201).json(newClass);
  } catch (err) {
    console.error("❌ createClass error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all classes
const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate("teachers", "name email")
      .populate("students", "name email")
      .populate("subjects", "name code");
    res.json(classes);
  } catch (err) {
    console.error("❌ getAllClasses error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= SUBJECT MANAGEMENT =========================

// ✅ Create subject
const createSubject = async (req, res) => {
  try {
    const { name, code } = req.body;
    const subject = new Subject({ name, code });
    await subject.save();
    res.status(201).json(subject);
  } catch (err) {
    console.error("❌ createSubject error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all subjects
const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (err) {
    console.error("❌ getAllSubjects error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= EXAM MANAGEMENT =========================

// ✅ Create exam
const createExam = async (req, res) => {
  try {
    const { title, classId, subject, totalMarks, date, teacher } = req.body;
    const exam = new Exam({
      title,
      classId,
      subject,
      totalMarks,
      date,
      teacher,
    });
    await exam.save();
    res.status(201).json(exam);
  } catch (err) {
    console.error("❌ createExam error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all exams
const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate("classId", "name section")
      .populate("subject", "name code")
      .populate("teacher", "name email");
    res.json(exams);
  } catch (err) {
    console.error("❌ getAllExams error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  // Users
  createUser,
  getAllUsers,
  deleteUser,
  // Classes
  createClass,
  getAllClasses,
  // Subjects
  createSubject,
  getAllSubjects,
  // Exams
  createExam,
  getAllExams,
};
