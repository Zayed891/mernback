const mongoose = require("mongoose");
const express = require("express");
const { User, Course, Admin } = require("../db");
const jwt = require("jsonwebtoken");
const { authenticateJwt, SECRETKEY } = require("../middleware/auth");

const router = express.Router();

router.post("/signup", async (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    res.status(403).json({ message: "User already exists" });
  } else {
    const newUser = new User({ username, password });
    newUser.save();
    const token = jwt.sign({ username, role: "user" }, SECRETKEY, {
      expiresIn: "1h",
    });
    res.json({ message: "Sign Up Successful", token });
  }
});

router.post("/login", async (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  const user = await User.findOne({ username, password });
  if (user) {
    const token = jwt.sign({ username, role: "user" }, SECRETKEY, {
      expiresIn: "1h",
    });
    res.json({ message: "Login successful", token });
  } else {
    res.status(403).json({ message: "Username or password is Invalid" });
  }
});
router.get("/courses", authenticateJwt, async (req, res) => {
  // logic to list all courses
  const courses = await Course.find({ published: true });
  res.json({ courses });
});
router.post("/courses/:courseId", authenticateJwt, async (req, res) => {
  // logic to purchase a course
  const course = await Course.findById(req.params.courseId);
  if (course) {
    const user = await User.findOne({ username: req.user.username });
    if (user) {
      user.purchasedCourses.push(course);
      await user.save();
      res.json({ message: "Course purchased successfully" });
    } else {
      res.status(403).json({ message: "User not found" });
    }
  } else {
    res.status(403).json({ message: "Course not found" });
  }
});

router.get("/purchasedCourses", authenticateJwt, async (req, res) => {
  // logic to view purchased courses
  const user = await User.findOne({ username: req.user.username }).populate(
    "purchasedCourses"
  );
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses || [] });
  } else {
    res.status(403).json({ message: "User not found" });
  }
});

module.exports = router