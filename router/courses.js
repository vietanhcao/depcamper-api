const express = require('express');
const { getCourses, updateCourses, getCourse, addCourse } = require('../controllers/courses');

const router = express.Router({mergeParams: true});

router.route('/').get(getCourses).post(addCourse);

router.route('/:id').get(getCourse).put(updateCourses)

module.exports = router;
