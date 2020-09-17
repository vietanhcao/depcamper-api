const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const path = require('path');

/**
 * @desc Get all bootcamps
 * @route Get /api/v1/bootcamps
 * @access public
 */
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResult); // advancedResult  
});

/**
 * @desc Get single bootcamp
 * @route Get /api/v1/bootcamps/id
 * @access public
 */
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id).populate('courses');
  if (!bootcamp)
    return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
  res.status(200).json({ success: true, data: bootcamp });
});

/**
 * @desc Update single bootcamp
 * @route Put /api/v1/bootcamps/id
 * @access public
 */
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp)
    return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));

  // Make sure user is bootcamp owner
  if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this bootcamp`, 403));
  }

  bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })


  res.status(200).json({ success: true, data: bootcamp });
});

/**
 * @desc create new bootcamps
 * @route Post /api/v1/bootcamps
 * @access private
 */
exports.createBootcamps = asyncHandler(async (req, res, next) => {
  // Add user to req,body
  req.body.user = req.user.id;

  // Check for published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  // If the user is not an admin, they can only add one bootcamp
  if(publishedBootcamp && req.user.role !== 'admin'){
    return next(new ErrorResponse(`The user width ID ${req.user.id} has already published a bootcamp`, 400));
  }

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
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp)
    return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    
  // Make sure user is bootcamp owner
  if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 403));
  }
		
	bootcamp.remove(); //trigger pre remove 
	
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

  res.status(200).json({ success: true, data: bootcamps, count: bootcamps.length });
});

/**
 * @desc Upload photo for bootcamps
 * @route Put /api/v1/bootcamps/:id/photo
 * @access private
 */
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp)
		return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
		
	if(!req.files){
		return next(new ErrorResponse(`Please upload a file`, 400));
  }

  // Make sure user is bootcamp owner
  if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 403));
  }

  const { file } = req.files;

  // Make sure the image is a photo
  if(!file.mimetype.startsWith("image")){
    return next(new ErrorResponse(`Please upload image file`, 400));
  }

  // Check fileSize
  if(file.size > process.env.MAX_FILE_UPLOAD){
    return next(new ErrorResponse(`Please upload image file less than ${process.env.MAX_FILE_UPLOAD}`, 400));
  }

  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if(err){
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name});
    
    res.status(200).json({success: true, data: file.name})
  })


});