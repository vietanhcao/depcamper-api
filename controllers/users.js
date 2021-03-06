const User = require("../models/User");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/ErrorResponse");

/**
 * @desc Get all users
 * @route Get /api/v1/users
 * @access Private/Admin
 */
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResult);
});

/**
 * @desc Get single user
 * @route Get /api/v1/users/:id
 * @access Private/Admin
 */
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({ success: true, data: user });
});

/**
 * @desc Create user
 * @route Post /api/v1/users
 * @access Private/Admin
 */
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({ success: true, data: user });
});

/**
 * @desc Update user
 * @route Put /api/v1/users/:id
 * @access Private/Admin
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  // const updates = Object.keys(req.body);
  // const allowedUpdates = ['name', 'role'];
  // const isValidOperator = updates.every( update => allowedUpdates.includes(update));

  // if(!isValidOperator){
  //   return next(new ErrorResponse(`Invalid updates`, 400)); 
  // }



  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: user });
});

/**
 * @desc Delete user
 * @route Delete /api/v1/users/:id
 * @access Private/Admin
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(201).json({ success: true, data: {} });
});
