const mongoose = require("mongoose");
const express = require("express");
const { User, Course, Admin } = require("../db/index");
const jwt = require("jsonwebtoken");
const { authenticateJwt, SECRETKEY } = require("../middleware/auth");

const router = express.Router();

router.get("/me", authenticateJwt, async (req, res) => {
  const admin = await Admin.findOne({ username: req.user.username });
  if (!admin) {
    res.status(403).json({ msg: "Admin doesnt exist" });
    return;
  }
  res.json({
    username: admin.username,
  });
});

router.post("/signup", async (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (admin) {
    res.json({ message: "Admin Already Exists" });
  } else {
    const newAdmin = new Admin({ username, password });
    await newAdmin.save();
    const token = jwt.sign({ username, role: "admin" }, SECRETKEY, {
      expiresIn: "1h",
    });
    res.json({ message: "Signed up successfully", token });
  }
});

router.post("/login", async (req, res) => {
  // logic to log in admin
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username, password });
  if (admin) {
    const token = jwt.sign({ username, role: "admin" }, SECRETKEY, {
      expiresIn: "1h",
    });
    res.json({ message: "Login Successful", token });
  } else {
    res.status(403).json({ message: "Invalid username or password" });
  }
});

router.post("/courses", authenticateJwt, async (req, res) => {
  // logic to create a course
  const course = new Course(req.body);
  await course.save();
  res.json({ message: "Course created successfully", courseId: course.id });
});

router.put("/courses/:courseId", authenticateJwt, async (req, res) => {
  // logic to edit a course
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {
    new: true,
  });
  if (course) {
    res.json({ message: "Course Updated Successfully" });
  } else {
    res.status(403).json({ message: "Course Not found" });
  }
});

router.get("/courses", authenticateJwt, async (req, res) => {
  // logic to get all courses
  try{
    const courses = await Course.find({});
    return res.status(200).json({ courses });
  } catch(err){
    return res.status(500).json({"error": err});
  }
});

router.get("/course/:courseId", authenticateJwt, async (req, res) => {
  const courseId = req.params.courseId;
  const course = await Course.findById(courseId);
  res.json({ course });
});

module.exports = router