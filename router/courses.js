const express = require("express");
const {
  getCourses,
  updateCourses,
  getCourse,
  addCourse,
  deleteCourse,
} = require("../controllers/courses");
const Course = require("../models/Course");

const router = express.Router({ mergeParams: true });

const advancedResult = require("../middleware/advancedResult");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResult(Course, {
      path: "bootcamp", // bootcamp field
      select: "name description",
    }),
    getCourses,
  )
  .post(protect, authorize("publisher", "admin"), addCourse);

router
  .route("/:id")
  .get(getCourse)
  .put(protect, authorize("publisher", "admin"), updateCourses)
  .delete(protect, authorize("publisher", "admin"), deleteCourse);

module.exports = router;
