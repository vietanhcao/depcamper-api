const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

/**
 * @desc Get all bootcamps
 * @route Get /api/v1/bootcamps
 * @access public
 */
exports.getBootcamps = asyncHandler(async (req, res, next) => {
	const bootcamps = await Bootcamp.find();
	res.status(200).json({ success: true, data: bootcamps });
});

/**
 * @desc Get single bootcamp
 * @route Get /api/v1/bootcamps/id
 * @access public
 */
exports.getBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);
	if (!bootcamp)
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	res.status(200).json({ success: true, data: bootcamp });
});

/**
 * @desc Update single bootcamp
 * @route Put /api/v1/bootcamps/id
 * @access public
 */
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});
	if (!bootcamp)
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	res.status(200).json({ success: true, data: bootcamp });
});

/**
 * @desc create new bootcamps
 * @route Post /api/v1/bootcamps
 * @access private
 */
exports.createBootcamps = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.create(req.body);
	res.status(201).json({
		success: true,
		data: bootcamp,
	});
});

/**
 * @desc Delete bootcamps
 * @route Delete /api/v1/bootcamps/:id
 * @access private
 */
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
	if (!bootcamp)
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	res.status(200).json({
		success: true,
		data: {},
	});
});
