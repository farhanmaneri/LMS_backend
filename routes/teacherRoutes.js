const express = require("express");
const router = express.Router();
const {
  getMyClasses,
  getMySubjects,
  getMyStudents,
  getMyExams,
  createExam,
  getMyStudentsResults,
} = require("../controllers/teacherController");

const { protect, authorize } = require("../middlewares/auth");

// All teacher routes protected & role = teacher
router.use(protect, authorize("teacher"));

router.get("/classes", getMyClasses);
router.get("/subjects", getMySubjects);
router.get("/students", getMyStudents);
router.get("/exams", getMyExams);
router.post("/exams", createExam);
router.get("/results", getMyStudentsResults);

module.exports = router;
