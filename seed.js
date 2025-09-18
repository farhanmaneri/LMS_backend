const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Class = require("./models/Class");
const Subject = require("./models/Subject");
const Exam = require("./models/Exam");
const Result = require("./models/Result");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // Clear existing
    await Promise.all([
      User.deleteMany(),
      Class.deleteMany(),
      Subject.deleteMany(),
      Exam.deleteMany(),
      Result.deleteMany(),
    ]);

    // 1️⃣ Create a Class
    const classA = new Class({ name: "Grade 5", section: "A" });
    await classA.save();

    // 2️⃣ Create a Subject
    const subject1 = new Subject({ name: "Mathematics" });
    await subject1.save();

    // 3️⃣ Create a Teacher
    const teacherPassword = "teacher123";
    const teacher1 = new User({
      name: "Mr. Ali",
      email: "teacher123@example.com",
      password: teacherPassword,
      role: "teacher",
      subjects: [subject1._id],
      assignedClasses: [classA._id],
    });
    await teacher1.save();

    // 4️⃣ Create an Exam
    const exam1 = new Exam({
      title: "Math Midterm",
      subject: subject1._id,
      classId: classA._id,
      teacher: teacher1._id,
      totalMarks: 100,
      date: new Date("2025-10-01"),
    });
    await exam1.save();

    // 5️⃣ Create a Student
    const studentPassword = "student123";
    const student1 = new User({
      name: "Sara Khan",
      email: "student1234@example.com",
      password: studentPassword,
      role: "student",
      rollNumber: "R001",
      classId: classA._id,
      parentContact: "03001234567",
    });
    await student1.save();

    // 6️⃣ Add Student to Class
    classA.students.push(student1._id);
    await classA.save();

    // 7️⃣ Create Result
    const result1 = new Result({
      student: student1._id,
      classId: classA._id,
      subject: subject1._id,
      exam: exam1._id,
      marksObtained: 85,
      totalMarks: 100,
      grade: "A",
      remarks: "Excellent work",
    });
    await result1.save();

    console.log("✅ Seed Data Created");
    console.log("Class ID:", classA._id.toString());
    console.log("Subject ID:", subject1._id.toString());
    console.log("Teacher ID:", teacher1._id.toString());
    console.log("Exam ID:", exam1._id.toString());
    console.log("Student ID:", student1._id.toString());
    console.log("Result ID:", result1._id.toString());

    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    mongoose.disconnect();
  }
};

seed();
