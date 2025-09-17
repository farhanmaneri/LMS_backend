const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // Common fields
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      required: true,
    },
    profileImage: String,
    contact: String,

    // Student-specific
    rollNumber: String,
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
    parentContact: String,

    // Teacher-specific
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
    assignedClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],

    // Relations (for quick population, optional)
    exams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exam" }], // exams created (if teacher)
    results: [{ type: mongoose.Schema.Types.ObjectId, ref: "Result" }], // results of student
    attendance: [{ type: mongoose.Schema.Types.ObjectId, ref: "Attendance" }], // attendance records

    // Password reset
    resetToken: String,
    resetTokenExpiry: Date,
  },
  { timestamps: true }
);

// 🔐 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔑 Compare passwords
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
