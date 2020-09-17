const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");
const Review = require("../models/Review");
const Bootcamp = require("../models/Bootcamp");

/**
 * @desc Get reviews
 * @route Get /api/v1/reviews
 * @route Get /api/v1/bootcapms/:bootcampId/reviews       // use mergeParams
 * @access Public
 */
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    return res.status(200).json(res.advancedResult);
  }
});

/**
 * @desc Get signle review
 * @route Get /api/v1/reviews/:id
 * @access Public
 */
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!review) {
    return next(
      new ErrorResponse(`No review found with the id of ${req.params.id}`, 404),
    );
  }
  return res.status(200).json({ success: true, data: review });
});

/**
 * @desc Add review
 * @route Post /api/v1/bootcamps/:bootcampId/reviews
 * @access Private
 */
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No Bootcamp with the id ${req.params.bootcampId}`,
        404,
      ),
    );
  }

  const review = await Review.create(req.body);

  return res.status(201).json({ success: true, data: review });
});

/**
 * @desc Update review
 * @route Put /api/v1/reviews/:id
 * @access Private
 */
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No Review with the id ${req.params.id}`, 404),
    );
  }

  // Make sure review belong to user or user is admin
  if (req.user.id !== review.user.toString() && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorized to update review`, 403));
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({ success: true, data: review });
});

/**
 * @desc Delete review
 * @route Delete /api/v1/reviews/:id
 * @access Private
 */
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No Review with the id ${req.params.id}`, 404),
    );
  }

  // Make sure review belong to user or user is admin
  if (req.user.id !== review.user.toString() && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorized to update review`, 403));
  }

  await Review.findByIdAndDelete(req.params.id);

  return res.status(200).json({ success: true, data: {} });
});
