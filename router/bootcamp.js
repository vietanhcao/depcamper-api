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
const advancedResult = require("../middleware/advancedResult");
const Bootcamp = require("../models/Bootcamp");

const router = express.Router();

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router
  .route("/")
  .get(advancedResult(Bootcamp, "courses"), getBootcamps) //implements custom middleware
  .post(createBootcamps);

router.route("/:id/photo").put(bootcampPhotoUpload);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
