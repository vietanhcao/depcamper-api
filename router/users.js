const express = require("express");
const User = require("../models/User");

const router = express.Router();

const advancedResult = require("../middleware/advancedResult");
const { protect, authorize } = require("../middleware/auth");
const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

router.use(protect);
router.use(authorize("admin"));


router
  .route("/")
  .get(advancedResult(User), getUsers)
  .post(createUser);

router
  .route("/:id")
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
