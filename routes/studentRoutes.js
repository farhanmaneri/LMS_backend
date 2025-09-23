const express = require("express");
const router = express.Router();

const {
  getMyClass,
  getMySubjects,
  getMyExams,
  getMyResults,
} = require("../controllers/studentController");

const { protect, authorize } = require("../middlewares/auth");

// All student routes protected & role = student
router.use(protect, authorize("student"));

router.get("/class", getMyClass);
router.get("/subjects", getMySubjects);
router.get("/exams", getMyExams);
router.get("/results", getMyResults);

module.exports = router;
