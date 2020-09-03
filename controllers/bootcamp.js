const Bootcamp = require("../models/Bootcamp");

/**
 * @desc Get all bootcamps
 * @route Get /api/v1/bootcamps
 * @access public
 */
exports.getBootcamps = async (req, res, next) => {
	try {
		const bootcamps = await Bootcamp.find();

		res.status(200).json({ success: true, data: bootcamps });
	} catch (error) {
		res.status(400).json({ success: false });
	}
};

/**
 * @desc Get single bootcamp
 * @route Get /api/v1/bootcamps/id
 * @access public
 */
exports.getBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.findById(req.params.id);
		if (!bootcamp) return res.status(400).json({ success: false });
		res.status(200).json({ success: true, data: bootcamp });
	} catch (error) {
		res.status(400).json({ success: false });
	}
};

/**
 * @desc Update single bootcamp
 * @route Put /api/v1/bootcamps/id
 * @access public
 */
exports.updateBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!bootcamp) return res.status(400).json({ success: false });
		res.status(200).json({ success: true, data: bootcamp });
	} catch (error) {
		res.status(400).json({ success: false });
	}
};

/**
 * @desc create new bootcamps
 * @route Post /api/v1/bootcamps
 * @access private
 */
exports.createBootcamps = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.create(req.body);
		res.status(201).json({
			success: true,
			data: bootcamp,
		});
	} catch (error) {
		res.status(400).json({ success: false });
	}
};

/**
 * @desc Delete bootcamps
 * @route Delete /api/v1/bootcamps/:id
 * @access private
 */
exports.deleteBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
		if (!bootcamp) return res.status(400).json({ success: false });
		res.status(200).json({
			success: true,
			data: {},
		});
	} catch (error) {
		res.status(400).json({ success: false });
	}
};
