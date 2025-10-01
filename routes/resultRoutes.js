const express = require("express");
const { protect, authorize, adminOnly } = require("../middlewares/auth.js");
const { addResult, getStudentResults,  } = require("../controllers/resultController");


const router = express.Router();

router.post("/", protect, adminOnly, addResult);       // Admin/Teacher adds result


// Teacher/Admin can fetch results of any student
router.get(
  "/",
  protect,
  authorize("teacher", "admin"),
  getStudentResults
);

module.exports = router;
