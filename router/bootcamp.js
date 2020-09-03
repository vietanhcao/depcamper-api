const express = require('express');
const { getBootcamps, createBootcamps, getBootcamp, updateBootcamp, deleteBootcamp } = require('../controllers/bootcamp');

const router = express.Router();


router
  .route('/')
  .get(getBootcamps)
  .post(createBootcamps)

  router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp)
  


module.exports = router
