const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");
const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");

/**
 * @desc Get course
 * @route Get /api/v1/courses
 * @route Get /api/v1/bootcapms/:bootcampId/courses       // use mergeParams
 * @access Public
 */
exports.getCourses = asyncHandler(async (req, res, next) => {

  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    return  res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    return res.status(200).json(res.advancedResult)
  }

});

/**
 * @desc Get single course
 * @route Get /api/v1/courses
 * @access Private
 */
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
    // match:{weeks: '6'},
    //   options: {
    //     limit: parseInt(req.query.limit),
    //     skip: parseInt(req.query.skip),
    //     sort // sort[parts[0]] = parts[1] === 'desc' ? -1 : 1 // GET /tasks?sortBy=createdAt:desc
    // }
  });

  if (!course)
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`, 404),
    );

  res.status(200).json({
    success: true,
    data: course
  })
});

/**
 * @desc Add course
 * @route Post /api/v1/bootcamps/:bootcampId/courses
 * @access Private
 */
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;  //add bootcamp before create
  req.body.user = req.user.id; //add user before create

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp)
    return next(
      new ErrorResponse(`No bootcamp with the id of ${req.params.id}`, 404),
    );
  
  // Make sure user is bootcamp owner
  if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to add course to bootcamp ${bootcamp._id}`, 403));
  }

  const course = await Course.create(req.body);


  res.status(201).json({
    success: true,
    data: course
  })
});


/**
 * @desc Update course
 * @route Put /api/v1/courses/:id
 * @access Private
 */
exports.updateCourses = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course)
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`, 404),
    );
  
  // Make sure user is course owner
  if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update course ${course._id}`, 403));
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

/**
 * @desc Delete course
 * @route Delete /api/v1/courses/:id
 * @access Private
 */
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course)
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`, 404),
    );

  // Make sure user is course owner
  if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete course ${course._id}`, 403));
  }
  
  await course.remove();


  res.status(200).json({
    success: true,
    data: {},
  });
});
