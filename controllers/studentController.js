const Class = require("../models/Class");
const Exam = require("../models/Exam");
const Result = require("../models/Result");
const Subject = require("../models/Subject");

const getMyClass = async (req, res) => {
  try {
    const studentId = req.user.id;

    const myClass = await Class.findOne({ students: studentId })
      .populate("teachers", "name email")
      .populate("subjects", "name code");

    if (!myClass) {
      return res
        .status(200)
        .json({ message: "No class assigned yet", class: null });
    }

    res.json(myClass);
  } catch (err) {
    console.error("❌ getMyClass error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getMySubjects = async (req, res) => {
  try {
    const studentId = req.user.id;

    const myClass = await Class.findOne({ students: studentId }).populate(
      "subjects"
    );
    if (!myClass) {
      return res
        .status(200)
        .json({ message: "No class/subjects assigned yet", subjects: [] });
    }

    res.json(myClass.subjects);
  } catch (err) {
    console.error("❌ getMySubjects error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getMyExams = async (req, res) => {
  try {
    const studentId = req.user.id;

    const myClass = await Class.findOne({ students: studentId });
    if (!myClass) {
      return res.status(200).json({ message: "No class assigned", exams: [] });
    }

    const exams = await Exam.find({ classId: myClass._id })
      .populate("subject", "name code")
      .populate("teacher", "name email");

    res.json(exams);
  } catch (err) {
    console.error("❌ getMyExams error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getMyResults = async (req, res) => {
  try {
    const studentId = req.user.id;

    const results = await Result.find({ student: studentId })
      .populate("exam", "title totalMarks date")
      .populate("subject", "name code")
      .populate("classId", "name section");

    if (!results.length) {
      return res.status(200).json({ message: "No results found", results: [] });
    }

    res.json(results);
  } catch (err) {
    console.error("❌ getMyResults error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getMyClass,
  getMySubjects,
  getMyExams,
  getMyResults,
};
