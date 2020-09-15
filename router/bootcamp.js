const express = require("express");
const {
  getBootcamps,
  createBootcamps,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamp");
// Include other resource router
const courseRouter = require("./courses.js");
const Bootcamp = require("../models/Bootcamp");

const router = express.Router();

const advancedResult = require("../middleware/advancedResult");
const { protect, authorize } = require("../middleware/auth");


// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router
  .route("/")
  .get(advancedResult(Bootcamp, "courses"), getBootcamps) //implements custom middleware
  .post(protect, createBootcamps);

router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), bootcampPhotoUpload);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize("publisher", "admin"), updateBootcamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp);

module.exports = router;
