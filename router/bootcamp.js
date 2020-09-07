const express = require("express");
const {
	getBootcamps,
	createBootcamps,
	getBootcamp,
	updateBootcamp,
	deleteBootcamp,
	getBootcampsInRadius,
} = require("../controllers/bootcamp");
// Include other resource router
const courseRouter = require('./courses.js')

const router = express.Router();

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter )

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router.route("/").get(getBootcamps).post(createBootcamps);

router
	.route("/:id")
	.get(getBootcamp)
	.put(updateBootcamp)
	.delete(deleteBootcamp);

module.exports = router;
