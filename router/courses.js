const express = require("express");
const {
  getCourses,
  updateCourses,
  getCourse,
  addCourse,
  deleteCourse,
} = require("../controllers/courses");
const advancedResult = require("../middleware/advancedResult");
const Course = require("../models/Course");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

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
