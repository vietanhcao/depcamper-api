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
  .post(addCourse);

router.route("/:id").get(getCourse).put(updateCourses).delete(deleteCourse);

module.exports = router;
