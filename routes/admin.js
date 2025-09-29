const express = require("express");
const router = express.Router();

const {
  createUser,
  getAllUsers,
  deleteUser,
  getUserById,
  createClass,
  getAllClasses,
  createSubject,
  getAllSubjects,
  createExam,
  getAllExams,
} = require("../controllers/admin");

const { protect, authorize } = require("../middlewares/auth");

// Protect all admin routes, only role = admin
router.use(protect, authorize("admin"));

// Users
router.post("/create-user", createUser);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.get("/users/:id", getUserById);

// Classes
router.post("/classes", createClass);
router.get("/classes", getAllClasses);

// Subjects
router.post("/subjects", createSubject);
router.get("/subjects", getAllSubjects);

// Exams
router.post("/exams", createExam);
router.get("/exams", getAllExams);

module.exports = router;
