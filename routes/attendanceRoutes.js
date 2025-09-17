
const express = require("express");
const { protect, adminOnly } = require("../middlewares/auth.js");
const { addAttendance, getStudentAttendance } = require("../controllers/attendanceController");

const router = express.Router();

router.post("/", protect, adminOnly, addAttendance);   // Teacher marks attendance
router.get("/:id", protect, getStudentAttendance);     // Student/Admin sees attendance

module.exports = router;
