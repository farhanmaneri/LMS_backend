const express = require("express");
const { protect, adminOnly } = require("../middlewares/auth.js");
const { addResult, getStudentResults, getStudentResult } = require("../controllers/resultController");


const router = express.Router();

router.post("/", protect, adminOnly, addResult);       // Admin/Teacher adds result
router.get("/:id", protect, getStudentResult);        // Student/Admin sees results
router.get("/", protect, adminOnly, getStudentResults);        // Student/Admin sees results

module.exports = router;
