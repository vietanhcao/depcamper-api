const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");

/**
 * @desc Get all bootcamps
 * @route Get /api/v1/bootcamps
 * @access public
 */
exports.getBootcamps = asyncHandler(async (req, res, next) => {
	let query;

	const reqQuery = { ...req.query };
	console.log("exports.getBootcamps -> reqQuery", reqQuery);
	
	// Fields  to exclude
	const removeFields = ['select','sort', 'page', 'limit'];

	// Loop over removeFields and delete them from reqQuery
	removeFields.forEach(params => delete reqQuery[params])

	let queryStr = JSON.stringify(reqQuery);

	// Create operator ($gt, $gte, etc)
	queryStr = queryStr.replace(
		/\b(gt|gte|lt|lte|in)\b/g,
		(match) => `$${match}`
	);

	query = Bootcamp.find(JSON.parse(queryStr));
	
	// Select Fields
	if(req.query.select){
		const fields = req.query.select.replace(/,/g, ' ');
		query = query.select(fields)
	}

	// Sort Fields
	if(req.query.sort){
		const sortBy = req.query.sort.replace(/,/g, ' ');
		query = query.sort(sortBy)
	}else{
		query = query.sort('-createdAt')
	}

	// pagination
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 25;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await Bootcamp.countDocuments()

	query = query.skip(startIndex).limit(limit);

	// Executing query
	const bootcamps = await query;

	// Pagination result
	const pagination = {};
	if(endIndex < total){
		pagination.next = {
			page: page + 1,
			limit: limit
		}
	}

	if(startIndex > 0){
		pagination.prev = {
			page: page - 1,
			limit: limit
		}
	}
	
	res
		.status(200)
		.json({ success: true, count: bootcamps.length,pagination, data: bootcamps });
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

/**
 * @desc Get bootcamps within a radius
 * @route Get /api/v1/bootcamps/radius/:zipcode/:distance
 * @access private
 */
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
	const { zipcode, distance } = req.params;

	// Get lat/lng from geocoder
	const loc = await geocoder.geocode(zipcode);
	const lat = loc[0].latitude;
	const lng = loc[0].longitude;

	// Calc radius using radians
	// Divide dist by radius of Earth
	// Earth radius = 3,963 mi / 6,378 km
	const radius = distance / 3963;

	const bootcamps = await Bootcamp.find({
		location: {
			$geoWithin: { $centerSphere: [[lng, lat], radius] },
		},
	});

	res
		.status(200)
		.json({ success: true, data: bootcamps, count: bootcamps.length });
});
