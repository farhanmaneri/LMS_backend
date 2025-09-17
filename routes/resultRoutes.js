const express = require("express");
const { protect, adminOnly } = require("../middlewares/auth.js");
const { addResult, getStudentResults } = require("../controllers/resultController");


const router = express.Router();

router.post("/", protect, adminOnly, addResult);       // Admin/Teacher adds result
router.get("/:id", protect, getStudentResults);        // Student/Admin sees results

module.exports = router;
