
const Result = require("../models/Result");
const Subject = require("../models/Subject");
const Exam = require("../models/Exam");
const User = require("../models/User");

const addResult = async (req, res) => {
  try {
    const { student, exam, classId, subject, marksObtained, totalMarks } = req.body;

    // Grade calculate
    let grade = "F";
    const percentage = (marksObtained / totalMarks) * 100;
    if (percentage >= 90) grade = "A+";
    else if (percentage >= 75) grade = "A";
    else if (percentage >= 60) grade = "B";
    else if (percentage >= 40) grade = "C";

    const result = new Result({ student, exam, classId,subject, marksObtained, totalMarks, grade });
    await result.save();

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getStudentResults = async (req, res) => {
  try {
    const results = await Result.find({ student: req.params.id })
      .populate("exam subject");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports= {addResult, getStudentResults}