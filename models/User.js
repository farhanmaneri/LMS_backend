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

    // Account status
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },

    // Student-specific fields
    rollNumber: {
      type: String,
      unique: true,
      sparse: true, // Allows null/undefined values while maintaining uniqueness for existing values
    },

    // 🎯 UPDATED: Make classId optional for flexible workflow
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      // Remove the required function - make it completely optional
      default: null,
    },

    // Track if student needs class assignment (for admin dashboard)
    needsClassAssignment: {
      type: Boolean,
      default: function () {
        return this.role === "student"; // Auto-set to true for students without class
      },
    },

    parentContact: String,
    parentEmail: String,

    // Teacher-specific fields
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
    assignedClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],

    // Teacher qualifications and info
    qualification: String,
    experience: Number, // years of experience
    joiningDate: Date,

    // Admin-specific fields
    permissions: [
      {
        type: String,
        enum: [
          "user_management",
          "class_management",
          "exam_management",
          "report_generation",
          "system_settings",
        ],
      },
    ],

    // Relations (for quick population, optional)
    exams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exam" }], // exams created (if teacher)
    results: [{ type: mongoose.Schema.Types.ObjectId, ref: "Result" }], // results of student
    attendance: [{ type: mongoose.Schema.Types.ObjectId, ref: "Attendance" }], // attendance records

    // Password reset
    resetToken: String,
    resetTokenExpiry: Date,

    // Login tracking
    lastLogin: Date,
    loginCount: { type: Number, default: 0 },

    // Academic year (useful for LMS)
    academicYear: {
      type: String,
      default: function () {
        const currentYear = new Date().getFullYear();
        return `${currentYear}-${currentYear + 1}`;
      },
    },
  },
  {
    timestamps: true,
    // Add indexes for better performance
    indexes: [
      { email: 1 },
      { role: 1 },
      { classId: 1 },
      { rollNumber: 1 },
      { academicYear: 1 },
    ],
  }
);

// 🔐 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🎯 Update needsClassAssignment when classId changes
userSchema.pre("save", function (next) {
  if (this.role === "student") {
    // If student has classId, they don't need assignment
    this.needsClassAssignment = !this.classId;
  } else {
    // Non-students don't need class assignment
    this.needsClassAssignment = false;
  }
  next();
});

// 🎯 Auto-generate roll number for students if not provided
userSchema.pre("save", async function (next) {
  if (this.role === "student" && !this.rollNumber && this.isNew) {
    try {
      // Generate roll number based on academic year and sequence
      const year = this.academicYear.split("-")[0].slice(-2); // Get last 2 digits of year
      const count = await this.constructor.countDocuments({
        role: "student",
        academicYear: this.academicYear,
      });
      this.rollNumber = `${year}${String(count + 1).padStart(4, "0")}`; // Format: 24001, 24002, etc.
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// 🔑 Compare passwords
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// 🎯 Instance method to assign class to student
userSchema.methods.assignToClass = async function (classId) {
  if (this.role !== "student") {
    throw new Error("Only students can be assigned to classes");
  }
  this.classId = classId;
  this.needsClassAssignment = false;
  return this.save();
};

// 🎯 Instance method to remove from class
userSchema.methods.removeFromClass = async function () {
  if (this.role !== "student") {
    throw new Error("Only students can be removed from classes");
  }
  this.classId = null;
  this.needsClassAssignment = true;
  return this.save();
};

// 🎯 Static method to get students without class assignment
userSchema.statics.getUnassignedStudents = function (academicYear = null) {
  const query = {
    role: "student",
    needsClassAssignment: true,
    isActive: true,
  };

  if (academicYear) {
    query.academicYear = academicYear;
  }

  return this.find(query).sort({ createdAt: -1 });
};

// 🎯 Static method to get students by class
userSchema.statics.getStudentsByClass = function (classId) {
  return this.find({
    role: "student",
    classId: classId,
    isActive: true,
  }).sort({ rollNumber: 1 });
};

// 🎯 Virtual for full name with roll number (for students)
userSchema.virtual("displayName").get(function () {
  if (this.role === "student" && this.rollNumber) {
    return `${this.name} (${this.rollNumber})`;
  }
  return this.name;
});

// 🎯 Virtual to check if user needs attention (unassigned student, etc.)
userSchema.virtual("needsAttention").get(function () {
  return this.role === "student" && this.needsClassAssignment;
});

// Ensure virtual fields are serialized
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("User", userSchema);
